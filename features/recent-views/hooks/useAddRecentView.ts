'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRecentViewAction } from '../actions';
import { getLocalStorage, setLocalStorage } from '@/utils';
import type { PostWithCompany } from '@/supabase';
import type { RecentView } from '../services/local-storage.types';
import { queryKeys } from '@/lib/query-keys';

const MAX_RECENT_VIEWS = 20;
const STORAGE_KEY = 'recent-posts';

export function useAddRecentView(isLoggedIn: boolean) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: PostWithCompany) => {
      // localStorage에 항상 저장 (전체 Post 데이터)
      const views = getLocalStorage<RecentView[]>(STORAGE_KEY, []);

      // 기존 기록 제거 (중복 방지)
      const filtered = views.filter((v) => v.postId !== post.id);

      // 최신 기록 추가
      const updated: RecentView[] = [{ postId: post.id, viewedAt: new Date().toISOString(), post }, ...filtered].slice(
        0,
        MAX_RECENT_VIEWS,
      );

      setLocalStorage(STORAGE_KEY, updated);

      // 로그인 시 DB에도 저장
      if (isLoggedIn) {
        await createRecentViewAction(post.id);
      }
    },
    onSuccess: () => {
      // 최근 본 글 쿼리 무효화하여 실시간 반영
      queryClient.invalidateQueries({ queryKey: queryKeys.recentViews.all });
    },
  });
}
