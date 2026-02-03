// Service Worker - Push 알림 수신 및 표시
// 이 파일은 public/ 루트에 있어야 함 (빌드 대상 아님)

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
