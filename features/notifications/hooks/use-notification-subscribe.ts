'use client';

import { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { saveSubscriptionAction } from '../actions';
import { detectDevice } from '../services';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

const SUBSCRIBE_FAILED_MESSAGE = '알림 구독에 실패했습니다. 잠시 후 다시 시도해주세요.';

// applicationServerKey는 base64url 문자열보다 BufferSource가 브라우저 호환성이 높음
function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const output = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i++) {
    output[i] = rawData.charCodeAt(i);
  }

  return output;
}

function isSameApplicationServerKey(existing: ArrayBuffer | null, next: Uint8Array): boolean {
  if (!existing) {
    return false;
  }
  const existingBytes = new Uint8Array(existing);
  return existingBytes.length === next.length && existingBytes.every((byte, i) => byte === next[i]);
}

export function useNotificationSubscribe() {
  const queryClient = useQueryClient();

  // Service Worker 등록 — 미지원 브라우저는 조용히 건너뛰고, 구독 시도 시점에 안내
  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    navigator.serviceWorker.register('/sw.js');
  }, []);

  const isSupported =
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window;

  const subscribeMutation = useMutation({
    mutationFn: async () => {
      if (!isSupported) {
        // iOS Safari는 홈 화면에 추가(PWA 설치)해야만 Push 지원
        throw new Error(
          detectDevice().device_os === 'ios'
            ? 'iOS는 Safari 공유 메뉴의 "홈 화면에 추가" 후 알림을 사용할 수 있습니다.'
            : '이 브라우저는 알림 기능을 지원하지 않습니다.',
        );
      }
      if (!VAPID_PUBLIC_KEY) {
        throw new Error(SUBSCRIBE_FAILED_MESSAGE);
      }

      const permission = await Notification.requestPermission();

      if (permission !== 'granted') {
        throw new Error('브라우저에서 알림 권한을 허용해주세요.');
      }

      // 등록 완료된 registration을 기다림 (페이지 진입 직후 클릭해도 레이스 없음)
      // 등록 자체가 실패하면 ready가 영원히 pending이므로 타임아웃으로 방어
      const registration = await Promise.race([
        navigator.serviceWorker.ready,
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error(SUBSCRIBE_FAILED_MESSAGE)), 10_000)),
      ]);

      const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);

      // VAPID 키가 교체된 경우 기존 구독이 남아 있으면 subscribe가 InvalidStateError를 던짐 → 정리 후 재구독
      let subscription = await registration.pushManager.getSubscription();

      if (
        subscription &&
        !isSameApplicationServerKey(subscription.options.applicationServerKey, applicationServerKey)
      ) {
        await subscription.unsubscribe();
        subscription = null;
      }

      if (!subscription) {
        try {
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey,
          });
        } catch {
          // DOMException의 영문 메시지가 토스트에 노출되지 않도록 변환
          throw new Error(SUBSCRIBE_FAILED_MESSAGE);
        }
      }

      const deviceInfo = detectDevice();
      const { endpoint, keys } = subscription.toJSON();

      if (!endpoint || !keys?.p256dh || !keys?.auth) {
        throw new Error(SUBSCRIBE_FAILED_MESSAGE);
      }

      const result = await saveSubscriptionAction(
        endpoint,
        keys.p256dh,
        keys.auth,
        deviceInfo.device_os,
        deviceInfo.browser,
      );

      if (!result.success) {
        throw new Error(SUBSCRIBE_FAILED_MESSAGE);
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
