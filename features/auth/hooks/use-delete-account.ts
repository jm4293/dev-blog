'use client';

import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { withdrawAction } from '../actions';

export const useDeleteAccount = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: () => withdrawAction(),
    onSuccess: () => {
      queryClient.clear();
      showToast({ type: 'success', message: '계정이 성공적으로 탈퇴되었습니다.' });
      router.push('/posts');
    },
  });
};
