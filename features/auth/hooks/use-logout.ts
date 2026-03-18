'use client';

import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logoutAction } from '@/features/auth/actions/logout.action';

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: () => logoutAction(),
    onSuccess: () => {
      queryClient.clear();
      showToast({ type: 'success', message: '로그아웃되었습니다.' });
      router.push('/posts');
    },
  });
}
