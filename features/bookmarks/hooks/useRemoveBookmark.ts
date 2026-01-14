'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BookmarkWithPost } from '@/supabase';

export const useRemoveBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const response = await fetch(`/api/bookmarks?postId=${postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove bookmark');
      }

      return await response.json();
    },
    onMutate: async (postId: string) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ['bookmarks'] });

      // 이전 데이터 백업
      const previousData = queryClient.getQueryData<{ bookmarks: BookmarkWithPost[] }>(['bookmarks']);

      // 낙관적 업데이트: 해당 postId의 북마크 제거
      if (previousData) {
        queryClient.setQueryData(['bookmarks'], {
          bookmarks: previousData.bookmarks.filter((b) => b.post_id !== postId),
        });
      }

      return { previousData };
    },
    onSuccess: () => {
      // 서버에서 정확한 데이터 다시 가져오기
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
    onError: (_error, _postId, context) => {
      // 에러 발생 시 이전 데이터로 롤백
      if (context?.previousData) {
        queryClient.setQueryData(['bookmarks'], context.previousData);
      }
    },
  });
};
