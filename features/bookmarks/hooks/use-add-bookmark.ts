'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBookmarkAction } from '@/features/bookmarks';
import { queryKeys } from '@/lib/query-keys';
import { BookmarkWithPost } from '@/supabase/types.supabase';

export function useAddBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const result = await createBookmarkAction(postId);

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

      // 낙관적 업데이트 — updater 함수 형태라 목록 쿼리가 아직 로드 전이어도 즉시 반영된다
      // (페이지 진입 직후 첫 클릭에도 하트가 바로 채워져야 함)
      queryClient.setQueryData<{ bookmarks: BookmarkWithPost[] }>(queryKeys.bookmarks.list(), (old) => ({
        bookmarks: [
          ...(old?.bookmarks ?? []),
          // 임시 북마크 객체 (ID는 나중에 서버에서 받음)
          {
            id: `temp-${postId}`,
            user_id: '',
            post_id: postId,
            created_at: new Date().toISOString(),
            post: {} as any,
          } as BookmarkWithPost,
        ],
      }));

      return { previousData };
    },
    onError: (_error, postId, context) => {
      // 에러 발생 시 롤백 — 백업이 없으면(로드 전 클릭) 임시 항목만 제거
      if (context?.previousData) {
        queryClient.setQueryData(queryKeys.bookmarks.list(), context.previousData);
      } else {
        queryClient.setQueryData<{ bookmarks: BookmarkWithPost[] }>(queryKeys.bookmarks.list(), (old) =>
          old ? { bookmarks: old.bookmarks.filter((b) => b.post_id !== postId) } : old,
        );
      }
    },
    onSettled: (_data, error) => {
      // 성공 시에는 낙관적 캐시가 이미 정확하므로 즉시 재조회하지 않고 stale 표시만 한다
      // (토글마다 posts 조인이 포함된 무거운 목록 쿼리가 재실행되는 것을 방지)
      queryClient.invalidateQueries({
        queryKey: queryKeys.bookmarks.all,
        refetchType: error ? 'active' : 'none',
      });
    },
  });
}
