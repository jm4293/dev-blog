'use client';

import { useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { saveSubscriptionAction } from '../actions';
import { detectDevice } from '../services';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

export function useNotificationSubscribe() {
  const queryClient = useQueryClient();
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);

  // Service Worker 등록 — 미지원 브라우저는 조용히 건너뛰고, 구독 시도 시점에 안내
  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    navigator.serviceWorker.register('/sw.js').then((registration) => {
      registrationRef.current = registration;
    });
  }, []);

  const isSupported = typeof navigator !== 'undefined' && 'serviceWorker' in navigator;

  const subscribeMutation = useMutation({
    mutationFn: async () => {
      if (!isSupported) {
        throw new Error('이 브라우저는 알림 기능을 지원하지 않습니다.');
      }
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
