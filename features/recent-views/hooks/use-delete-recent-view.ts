'use client';

import { getLocalStorage, removeLocalStorage, setLocalStorage } from '@/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@/features/auth';
import { queryKeys } from '@/lib/query-keys';
import { clearAllRecentViews, deleteRecentViewAction } from '../actions';
import type { RecentView } from '../services/local-storage.types';

const STORAGE_KEY = 'recent-posts';

export function useDeleteRecentView() {
  const { data: user } = useUser();
  const isLoggedIn = !!user;
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

export function useClearAllRecentViews() {
  const { data: user } = useUser();
  const isLoggedIn = !!user;
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
