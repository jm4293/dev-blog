'use client';

import { useEffect, useCallback, useRef } from 'react';
import { detectDevice } from '../services/device-detect';
import { saveSubscriptionAction } from '../actions/saveSubscription.action';

/**
 * Push 구독 관리 훅
 * - Service Worker 등록
 * - 브라우저 권한 요청
 * - 구독 저장/해제
 */
export function usePushSubscription() {
  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
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

  // 구독 요청 (권한 허용 후 구독 저장)
  const subscribe = useCallback(async () => {
    if (!vapidPublicKey) {
      throw new Error('VAPID_PUBLIC_KEY is not defined');
    }
    if (!registrationRef.current) {
      throw new Error('Service Worker not registered');
    }

    // 브라우저 권한 요청
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Notification permission denied');
    }

    // Push 구독
    const subscription = await registrationRef.current.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: vapidPublicKey,
    });

    const deviceInfo = detectDevice();
    const { endpoint, keys } = subscription.toJSON();
    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      throw new Error('Invalid subscription');
    }

    const result = await saveSubscriptionAction(
      endpoint,
      keys.p256dh,
      keys.auth,
      deviceInfo.device_os,
      deviceInfo.browser,
    );
    if (!result.success) throw new Error(result.error);

    return subscription;
  }, [vapidPublicKey]);

  return { subscribe };
}
