// Service Worker - Push 알림 수신/표시 + 오프라인 캐시
// 이 파일은 public/ 루트에 있어야 함 (빌드 대상 아님)

const CACHE_VERSION = 'v1';
const PAGES_CACHE = `devblog-pages-${CACHE_VERSION}`;
const ASSETS_CACHE = `devblog-assets-${CACHE_VERSION}`;
const MAX_PAGE_ENTRIES = 30;

// 오프라인 폴백으로 쓸 기본 페이지 (설치 시점에 미리 캐시 — 실패해도 설치는 계속)
const FALLBACK_URL = '/posts';

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches
      .open(PAGES_CACHE)
      .then((cache) => cache.add(FALLBACK_URL))
      .catch(() => undefined)
      .then(() => self.skipWaiting()),
  );
});

// 이전 버전 캐시 정리
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith('devblog-') && key !== PAGES_CACHE && key !== ASSETS_CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// 페이지 캐시가 무한히 자라지 않도록 오래된 항목부터 정리
async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= maxEntries) return;
  await Promise.all(keys.slice(0, keys.length - maxEntries).map((key) => cache.delete(key)));
}

self.addEventListener('fetch', function (event) {
  const request = event.request;

  // GET + 같은 오리진만 처리. API/인증 요청은 캐시하지 않는다 (개인 데이터·최신성)
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/auth/')) return;

  // 1) 페이지 탐색: network-first — 온라인이면 항상 최신, 오프라인이면 마지막으로 본 페이지 제공
  if (request.mode === 'navigate') {
    // 사용자별 데이터가 렌더되는 페이지의 HTML은 캐시에 남기지 않는다
    const isPersonalPage = url.pathname.startsWith('/bookmarks') || url.pathname.startsWith('/profile');

    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok && !isPersonalPage) {
            const copy = response.clone();
            caches
              .open(PAGES_CACHE)
              .then((cache) => cache.put(request, copy))
              .then(() => trimCache(PAGES_CACHE, MAX_PAGE_ENTRIES))
              .catch(() => undefined);
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;

          const fallback = await caches.match(FALLBACK_URL);
          if (fallback) return fallback;

          return new Response(
            '<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>오프라인 - devBlog.kr</title><body style="display:flex;min-height:100vh;align-items:center;justify-content:center;font-family:sans-serif;background:#141414;color:#ebebeb;text-align:center"><div><h1 style="font-size:1.25rem">오프라인 상태입니다</h1><p style="color:#949494;font-size:.875rem">네트워크 연결 후 다시 시도해주세요.</p></div></body></html>',
            { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
          );
        }),
    );
    return;
  }

  // 2) 해시가 붙는 불변 빌드 자산: cache-first
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response.ok) {
              const copy = response.clone();
              caches
                .open(ASSETS_CACHE)
                .then((cache) => cache.put(request, copy))
                .catch(() => undefined);
            }
            return response;
          }),
      ),
    );
    return;
  }

  // 3) 이미지(로고 등): stale-while-revalidate — 캐시로 즉시 응답하고 백그라운드 갱신
  if (request.destination === 'image') {
    event.respondWith(
      caches.open(ASSETS_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        const network = fetch(request)
          .then((response) => {
            if (response.ok) {
              cache.put(request, response.clone()).catch(() => undefined);
            }
            return response;
          })
          .catch(() => undefined);
        return cached || network.then((response) => response || Response.error());
      }),
    );
  }
});

// Push 메시지 수신
self.addEventListener('push', function (event) {
  if (!event.data) {
    return;
  }

  let payload;

  try {
    payload = event.data.json();
  } catch {
    // JSON 파싱 실패 시 텍스트로 처리
    payload = { title: 'devBlog.kr', body: event.data.text(), url: '/' };
  }

  const title = payload.title || 'devBlog.kr';
  const options = {
    body: payload.body || '새로운 알림이 있습니다.',
    icon: payload.icon || '/logo_192.png',
    badge: payload.badge || '/logo_32.png',
    tag: payload.tag || 'devblog-notification', // 같은 tag면 중복 대신 덮어쓰기
    requireInteraction: false,
    data: { url: payload.url || '/posts' },
  };

  // 알림 표시는 비동기이므로 event.waitUntil로 감싸야 함
  event.waitUntil(self.registration.showNotification(title, options));
});

// 알림 클릭 시 해당 URL로 이동
self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  const url = event.notification.data?.url || '/posts';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (windowClients) {
      // 이미 열린 탭이 있으면 해당 탭으로 이동
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === new URL(url, self.registration.scope).href) {
          client.focus();
          return;
        }
      }
      // 열린 탭이 없으면 새 탭 열기
      return clients.openWindow(url);
    }),
  );
});
