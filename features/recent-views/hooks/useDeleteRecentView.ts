'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteRecentViewAction, clearAllRecentViews } from '../actions';
import { getLocalStorage, setLocalStorage, removeLocalStorage } from '@/utils';
import type { RecentView } from '../services/local-storage.types';
import { queryKeys } from '@/lib/query-keys';

const STORAGE_KEY = 'recent-posts';

export function useDeleteRecentView(isLoggedIn: boolean) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postIds: string[]) => {
      // localStorage에서 삭제
      const views = getLocalStorage<RecentView[]>(STORAGE_KEY, []);
      const filtered = views.filter((v) => !postIds.includes(v.postId));
      setLocalStorage(STORAGE_KEY, filtered);

      // 로그인 시 DB에서도 삭제
      if (isLoggedIn) {
        await deleteRecentViewAction(postIds);
      }
    },
    onSuccess: () => {
      // 쿼리 무효화하여 UI 업데이트
      queryClient.invalidateQueries({ queryKey: queryKeys.recentViews.all });
    },
  });
}

export function useClearAllRecentViews(isLoggedIn: boolean) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // localStorage 전체 삭제
      removeLocalStorage(STORAGE_KEY);

      // 로그인 시 DB에서도 전체 삭제
      if (isLoggedIn) {
        await clearAllRecentViews();
      }
    },
    onSuccess: () => {
      // 쿼리 무효화하여 UI 업데이트
      queryClient.invalidateQueries({ queryKey: queryKeys.recentViews.all });
    },
  });
}
