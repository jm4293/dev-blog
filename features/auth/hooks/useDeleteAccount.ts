'use client';

import { useMutation } from '@tanstack/react-query';
import { deleteAccountAction } from '@/features/auth/actions/deleteAccount.action';
import { useRouter } from 'next/navigation';

export const useDeleteAccount = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      await deleteAccountAction();
    },
    onSuccess: () => {
      // 회원탈퇴 완료 후 메인 페이지로 이동
      router.push('/posts');
    },
    onError: (error) => {
      console.error('Delete account error:', error);
    },
  });
};
