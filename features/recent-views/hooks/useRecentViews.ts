'use client';

import { useQuery } from '@tanstack/react-query';
import { getLocalStorage } from '@/utils';
import { RecentViewsResponse } from '@/supabase';
import type { RecentView } from '../services/local-storage.types';
import { queryKeys } from '@/lib/query-keys';

const STORAGE_KEY = 'recent-posts';

export function useRecentViews(isLoggedIn: boolean) {
  return useQuery({
    queryKey: queryKeys.recentViews.list(isLoggedIn),
    queryFn: async () => {
      if (!isLoggedIn) {
        // 비로그인: localStorage에서 조회 (전체 Post 데이터 포함)
        const localViews = getLocalStorage<RecentView[]>(STORAGE_KEY, []);

        // localStorage 데이터를 API 응답 형식에 맞게 변환
        return localViews.map((view) => ({
          id: view.postId,
          user_id: '',
          post_id: view.postId,
          viewed_at: view.viewedAt,
          post: view.post,
        }));
      }

      // 로그인: DB에서 조회
      const response = await fetch('/api/recent-views');
      if (!response.ok) throw new Error('Failed to fetch recent views');

      const data: RecentViewsResponse = await response.json();
      return data.recentViews;
    },
  });
}
