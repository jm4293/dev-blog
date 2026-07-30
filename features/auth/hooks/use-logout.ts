'use client';

import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks';
import { removeLocalStorage } from '@/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logoutAction } from '@/features/auth/actions/logout.action';
// 순환 import 방지를 위해 루트 배럴 대신 하위 모듈에서 직접 가져온다
import { RECENT_VIEWS_STORAGE_KEY } from '@/features/recent-views/services';

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
      // 로그아웃 후 로컬 열람 기록이 그대로 남으면 공용 PC에서 프라이버시 문제가 된다
      // (기록은 로그인 시 이미 DB로 이관되어 있어 유실되지 않음)
      removeLocalStorage(RECENT_VIEWS_STORAGE_KEY);
      showToast({ type: 'success', message: '로그아웃되었습니다.' });
      router.push('/posts');
    },
  });
}
