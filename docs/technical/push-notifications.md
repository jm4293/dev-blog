# Push 알림 구현 후기

devBlog.kr에 Push 알림을 추가했습니다. 왜 했는지부터 시작해서 구현 과정, 신경 쓰는 부분까지 정리해두었습니다.

---

## 시작

기존까지는 새 글이 수집되면 사이트에 직접 들어가야만 확인할 수 있었습니다. 매일 글이 올라오는 플랫폼이라서 "새 포스트가 등록되었다"라는 알림이 필요했고, Push 알림이 가장 적합한 방법이었습니다. 사이트를 방문하지 않아도 알림이 오는 것입니다.

---

## 준비

### Web Push API 선택

Firebase Cloud Messaging(FCM) SDK를 직접 사용하는 방식이 아니라 Web Push API를 사용했습니다. FCM SDK는 Chrome만 대상인 반면, Web Push API는 Chrome, Firefox, Safari 등 표준 브라우저 전체에서 동작합니다. 백엔드에서 실제로 Push를 보내는 부분은 `web-push` 패키지 하나로 처리됩니다.

### VAPID Keys

VAPID(Voluntary Application Server Identification)는 서버가 "나가 이 구독에 Push를 보내는 권한이 있다"는 것을 증명하는 암호화 키 쌍입니다. 공개키는 클라이언트에서 구독할 때, 개인키는 서버에서 발송할 때 사용됩니다. 한 번 생성하면 변경하지 않는 게 좋습니다. 바꾸면 기존 구독이 모두 무효화됩니다.

### DB 테이블

두 테이블을 추가했습니다.

- `push_subscriptions`: 기기별 구독 정보 (endpoint, 암호화 키, OS, 브라우저, 활성 여부)
- `notification_preferences`: 유저별 전체 알림 on/off 설정

---

## 어떻게 작동하는지

### 구독 흐름 (클라이언트)

사용자가 프로필 페이지에서 장치를 등록하면 구독이 시작됩니다. UI는 아래와 같습니다.

![알림 설정 UI](https://velog.velcdn.com/images/jm4293/post/3a1349e0-d564-4b08-b41d-1a1edcc9c924/image.png)

전체 토글과 기기별 토글로 나뉘고, 같은 OS의 기기는 하나로 묶여서 표시됩니다. 장치 등록 버튼을 누르면 아래 과정이 돌아가집니다.

```typescript
// useNotificationSubscribe.ts
export function useNotificationSubscribe() {
  const queryClient = useQueryClient();
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);

  // Service Worker 등록
  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      alert('해당 브라우저는 알림 기능을 지원하지 않습니다.');
      return;
    }

    navigator.serviceWorker.register('/sw.js').then((registration) => {
      registrationRef.current = registration;
    });
  }, []);

  const subscribeMutation = useMutation({
    mutationFn: async () => {
      // 브라우저 권한 요청
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Notification permission denied');
      }

      // FCM에 구독 등록 → endpoint URL 생성
      const subscription = await registrationRef.current!.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: VAPID_PUBLIC_KEY,
      });

      // 구독 정보와 기기 정보를 DB에 저장
      const deviceInfo = detectDevice();
      const { endpoint, keys } = subscription.toJSON();

      const result = await saveSubscriptionAction(
        endpoint,
        keys.p256dh,
        keys.auth,
        deviceInfo.device_os,
        deviceInfo.browser,
      );
      if (!result.success) throw new Error(result.error);

      return subscription;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.preferences() });
    },
  });

  return { subscribeMutation };
}
```

`pushManager.subscribe()`가 불리면 브라우저가 FCM에 등록하여 기기별 고유 `endpoint` URL을 생성합니다. 이 URL이 나중에 서버에서 Push를 보내는 주소가 됩니다.

### 발송 흐름 (서버)

글이 수집되면 GitHub Actions에서 발송 API를 호출합니다.

```
GitHub Actions (글 수집 완료)
  → POST /api/notifications/send { postsCreated: N }
    → DB에서 알림 활성화된 유저의 구독 목록 조회
    → web-push로 각 기기 endpoint에 메시지 발송
      → FCM이 해당 기기로 전달
        → Service Worker 수신 → OS 알림 팝업 표시
```

실제 발송은 `web-push`의 `sendNotification`으로 처리됩니다. 암호화는 라이브러리가 자동으로 해주고, 서버에서 신경 쓰는 건 endpoint와 키를 올바르게 전달하는 것뿐입니다.

```typescript
// app/api/notifications/send/route.ts
await webpush.sendNotification(
  {
    endpoint: sub.endpoint,
    keys: {
      p256dh: sub.p256dh,
      auth: sub.auth,
    },
  },
  payload, // JSON.stringify({ title, body, icon, badge, tag, url })
);
```

### Service Worker (sw.js)

백그라운드에서 실행되는 스크립트로, 두 가지를 담당합니다.

```javascript
// push 이벤트 — FCM에서 메시지를 받아 알림 표시
self.addEventListener('push', function (event) {
  const payload = event.data.json();
  const options = {
    body: payload.body,
    icon: payload.icon || '/logo_192.png',
    badge: payload.badge || '/logo_32.png',
    tag: payload.tag,
    data: { url: payload.url || '/posts' },
  };

  // waitUntil: 알림 표시가 완료될 때까지 SW를 종료하지 않음
  event.waitUntil(self.registration.showNotification(payload.title, options));
});

// notificationclick 이벤트 — 알림 클릭 시 페이지로 이동
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const url = event.notification.data?.url || '/posts';

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(function (windowClients) {
      // 이미 열린 탭이 있으면 그 탭으로 포커스
      for (let i = 0; i < windowClients.length; i++) {
        if (windowClients[i].url === new URL(url, self.registration.scope).href) {
          windowClients[i].focus();
          return;
        }
      }
      // 없으면 새 탭 열기
      return clients.openWindow(url);
    }),
  );
});
```

`event.waitUntil()`은 SW가 이벤트 핸들러 실행 후 바로 종료되지 않도록 하는 것입니다. 안 쓰면 비동기 작업이 완료되기 전에 SW가 꺼져서 알림이 안 표시될 수 있습니다.

---

## 구현하면서 신경 쓴 부분

### 만료된 구독 자동 정리

Push를 보내면 FCM이 410(Gone) 또는 404를 반환하는 경우가 있습니다. 유저가 알림 권한을 취소하거나 기기를 바꾸었을 때이지요. 이런 경우 해당 구독을 자동으로 DB에서 삭제합니다.

```typescript
// send/route.ts — 발송 후 실패한 endpoint를 모아서 한 번에 삭제
const failedEndpoints: string[] = [];

await Promise.all(
  subscriptions.map(async (sub) => {
    try {
      await webpush.sendNotification({ endpoint: sub.endpoint, keys: { ... } }, payload);
      sent++;
    } catch (err) {
      const statusCode = err instanceof Error && 'statusCode' in err ? (err as { statusCode: number }).statusCode : 0;
      if (statusCode === 410 || statusCode === 404) {
        failedEndpoints.push(sub.endpoint);
      }
    }
  }),
);

if (failedEndpoints.length > 0) {
  await supabase.from('push_subscriptions').delete().in('endpoint', failedEndpoints);
}
```

방치하면 불필요한 발송 시도가 계속 생기고, DB도 지저분해집니다.

### 낙관적 업데이트

알림 설정 토글은 서버 응답을 기다리지 않고 즉시 UI를 업데이트합니다. 실패하면 이전 상태로 복원하는 구조입니다.

```typescript
// useNotificationPreferences.ts
const toggleAllNotifications = useMutation({
  mutationFn: async (new_post_enabled: boolean) => {
    const result = await updatePreferencesAction(new_post_enabled);
    if (!result.success) throw new Error(result.error);
  },
  onMutate: async (new_post_enabled) => {
    await queryClient.cancelQueries({ queryKey: queryKeys.notifications.preferences() });
    const previous = queryClient.getQueryData<PreferencesResponse>(queryKeys.notifications.preferences());

    // setQueryData로 즉시 캐시 업데이트 → UI 반응
    queryClient.setQueryData<PreferencesResponse>(queryKeys.notifications.preferences(), (old) => {
      if (!old) return old;
      return { ...old, preferences: { ...old.preferences, new_post_enabled } };
    });

    return { previous };
  },
  onError: (_error, _variables, context) => {
    // 실패하면 이전 상태 복원
    if (context?.previous) {
      queryClient.setQueryData(queryKeys.notifications.preferences(), context.previous);
    }
  },
  onSettled: () => {
    // invalidateQueries로 서버 실제 데이터로 최종 갱신
    queryClient.invalidateQueries({ queryKey: queryKeys.notifications.preferences() });
  },
});
```

`setQueryData`는 캐시를 즉시 덮어쓰어 리렌더링을 트리거하고, `invalidateQueries`는 백그라운드에서 서버에 재요청하여 실제 응답으로 교체합니다. 둘이 다른 역할을 하는 것입니다. 토글 특성상 반응이 느리면 사용자가 여러 번 눌러댈 수 있으니, 즉시 반응하는 게 중요했습니다.
