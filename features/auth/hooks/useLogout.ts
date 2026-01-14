'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logoutAction } from '@/features/auth/actions/logout.action';
import { useRouter } from 'next/navigation';

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await logoutAction();
    },
    onSuccess: () => {
      // React Query 캐시 초기화
      queryClient.clear();
      router.push('/posts');
    },
    onError: (error) => {
      console.error('Logout error:', error);
    },
  });
};
