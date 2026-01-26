'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { withdrawAction } from '../actions';

export const useDeleteAccount = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await withdrawAction();
    },
    onSuccess: () => {
      // React Query 캐시 초기화
      queryClient.clear();
      // 회원탈퇴 완료 후 메인 페이지로 이동
      router.push('/posts');
    },
  });
};
