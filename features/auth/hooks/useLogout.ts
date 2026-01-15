'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';
import { logoutAction } from '@/features/auth/actions/logout.action';
import { useRouter } from 'next/navigation';
import { userAtom } from '@/atoms';

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useSetAtom(userAtom);

  return useMutation({
    mutationFn: async () => {
      await logoutAction();
    },
    onSuccess: () => {
      // Jotai atom 동기화
      setUser(null);
      // React Query 캐시 초기화
      queryClient.clear();
      router.push('/posts');
    },
    onError: () => {
      // 로그아웃 실패 처리 (옵션: 토스트 메시지 표시 가능)
    },
  });
};
