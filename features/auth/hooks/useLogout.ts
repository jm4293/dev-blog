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
      queryClient.clear();
      router.push('/posts');
    },
  });
};
