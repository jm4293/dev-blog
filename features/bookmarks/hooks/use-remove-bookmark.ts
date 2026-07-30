'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteBookmarkAction } from '@/features/bookmarks';
import { queryKeys } from '@/lib/query-keys';
import { BookmarkWithPost } from '@/supabase/types.supabase';

export function useRemoveBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const result = await deleteBookmarkAction(postId);

      if (!result.success) {
        throw new Error(result.error || 'Failed to remove bookmark');
      }

      return result;
    },
    onMutate: async (postId: string) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: queryKeys.bookmarks.all });

      // 이전 데이터 백업
      const previousData = queryClient.getQueryData<{ bookmarks: BookmarkWithPost[] }>(queryKeys.bookmarks.list());

      // 낙관적 업데이트 — updater 함수 형태 (목록 쿼리가 로드 전이면 no-op)
      queryClient.setQueryData<{ bookmarks: BookmarkWithPost[] }>(queryKeys.bookmarks.list(), (old) =>
        old ? { bookmarks: old.bookmarks.filter((b) => b.post_id !== postId) } : old,
      );

      return { previousData };
    },
    onError: (_error, _postId, context) => {
      // 에러 발생 시 이전 데이터로 롤백
      if (context?.previousData) {
        queryClient.setQueryData(queryKeys.bookmarks.list(), context.previousData);
      }
    },
    onSettled: (_data, error) => {
      // 성공 시에는 낙관적 캐시가 이미 정확하므로 즉시 재조회하지 않고 stale 표시만 한다
      queryClient.invalidateQueries({
        queryKey: queryKeys.bookmarks.all,
        refetchType: error ? 'active' : 'none',
      });
    },
  });
}
