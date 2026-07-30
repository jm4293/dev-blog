'use client';

import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logoutAction } from '@/features/auth/actions/logout.action';

/**
 * 현재 브라우저의 push 구독 endpoint 조회 (없거나 미지원이면 null)
 * 로그아웃 시 이 기기의 구독을 서버에서 삭제하기 위해 사용
 */
async function getCurrentPushEndpoint(): Promise<string | null> {
  try {
    if (!('serviceWorker' in navigator)) {
      return null;
    }

    const registration = await navigator.serviceWorker.getRegistration();
    const subscription = await registration?.pushManager.getSubscription();

    return subscription?.endpoint ?? null;
  } catch {
    return null;
  }
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const pushEndpoint = await getCurrentPushEndpoint();
      return logoutAction(pushEndpoint ?? undefined);
    },
    onSuccess: () => {
      queryClient.clear();
      showToast({ type: 'success', message: '로그아웃되었습니다.' });
      router.push('/posts');
    },
  });
}
