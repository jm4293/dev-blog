'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BookmarkWithPost } from '@/supabase';
import { addBookmark } from '@/features/bookmarks';
import { queryKeys } from '@/lib/query-keys';

export const useAddBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const result = await addBookmark(postId);

      if (!result.success) {
        throw new Error(result.error || 'Failed to add bookmark');
      }

      return result;
    },
    onMutate: async (postId: string) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: queryKeys.bookmarks.all });

      // 이전 데이터 백업
      const previousData = queryClient.getQueryData<{ bookmarks: BookmarkWithPost[] }>(queryKeys.bookmarks.list());

      // 낙관적 업데이트: bookmarks 데이터에 새 북마크 추가
      if (previousData) {
        queryClient.setQueryData(queryKeys.bookmarks.list(), {
          bookmarks: [
            ...previousData.bookmarks,
            // 임시 북마크 객체 (ID는 나중에 서버에서 받음)
            {
              id: `temp-${postId}`,
              user_id: '',
              post_id: postId,
              created_at: new Date().toISOString(),
              post: {} as any,
            } as BookmarkWithPost,
          ],
        });
      }

      return { previousData };
    },
    onSuccess: () => {
      // 서버에서 정확한 데이터 다시 가져오기
      queryClient.invalidateQueries({ queryKey: queryKeys.bookmarks.all });
    },
    onError: (_error, _postId, context) => {
      // 에러 발생 시 이전 데이터로 롤백
      if (context?.previousData) {
        queryClient.setQueryData(queryKeys.bookmarks.list(), context.previousData);
      }
    },
  });
};
