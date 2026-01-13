'use client';

import { useMutation } from '@tanstack/react-query';
import { logoutAction } from '@/features/auth/actions/logout.action';
import { useRouter } from 'next/navigation';

export const useLogout = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      await logoutAction();
    },
    onSuccess: () => {
      router.push('/posts');
    },
    onError: (error) => {
      console.error('Logout error:', error);
    },
  });
};
