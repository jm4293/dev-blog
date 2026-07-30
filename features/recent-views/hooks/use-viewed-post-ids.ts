'use client';

import { useCallback, useMemo } from 'react';
import { getLocalStorage } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { RECENT_VIEWS_STORAGE_KEY, type RecentView } from '../services/local-storage.types';

/**
 * 최근 본 글(postId) 조회 — 목록에서 "읽음" 표시용
 *
 * localStorage `recent-posts`는 로그인 여부와 무관하게 클릭 시 항상 기록되므로
 * 읽음 여부의 단일 소스로 쓸 수 있다. 글 클릭 시 recentViews.all 무효화로 즉시 갱신된다.
 */
export function useViewedPostIds(): (postId: string) => boolean {
  const { data } = useQuery({
    queryKey: queryKeys.recentViews.viewedIds(),
    queryFn: () => getLocalStorage<RecentView[]>(RECENT_VIEWS_STORAGE_KEY, []).map((view) => view.postId),
    staleTime: 0,
  });

  const viewedSet = useMemo(() => new Set(data ?? []), [data]);

  return useCallback((postId: string) => viewedSet.has(postId), [viewedSet]);
}
