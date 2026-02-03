'use client';

import { useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { detectDevice } from '../services';
import { saveSubscriptionAction } from '../actions';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

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
      if (!VAPID_PUBLIC_KEY) {
        throw new Error('VAPID_PUBLIC_KEY is not defined');
      }
      if (!registrationRef.current) {
        throw new Error('Service Worker not registered');
      }

      const permission = await Notification.requestPermission();

      if (permission !== 'granted') {
        throw new Error('Notification permission denied');
      }

      const subscription = await registrationRef.current.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: VAPID_PUBLIC_KEY,
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

      if (!result.success) {
        throw new Error(result.error);
      }

      return subscription;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.preferences() });
    },
  });

  return {
    subscribeMutation,
  };
}
