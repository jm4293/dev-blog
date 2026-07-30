'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import type { PostWithCompany } from '@/supabase/types.supabase';
import type { GetPostsResponse } from '../services/fetch-posts';
import { fetchPostsFromApi, type PostsFilters } from './use-posts';

/**
 * 모바일 "더 보기" — 현재(URL 기준) 페이지 뒤의 페이지들을 눌러서 이어 붙인다.
 *
 * URL은 건드리지 않으므로 공유/뒤로가기는 기준 페이지를 유지하고,
 * 검색·필터·정렬·기준 페이지가 바뀌면 누적을 초기화한다.
 * 조회는 usePosts와 같은 queryKey/fetch를 쓰므로 페이지네이션 캐시와 공유된다.
 */
export function useLoadMorePosts(filters: PostsFilters, baseData: GetPostsResponse | undefined) {
  const queryClient = useQueryClient();
  const [extraPages, setExtraPages] = useState<GetPostsResponse[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState(false);

  // 필터/기준 페이지가 바뀌면 누적 초기화 — 렌더 중 상태 조정 패턴
  const filtersKey = `${filters.page}|${filters.search}|${filters.tags.join(',')}|${filters.blogs.join(',')}|${filters.sort}`;
  const [prevFiltersKey, setPrevFiltersKey] = useState(filtersKey);
  if (prevFiltersKey !== filtersKey) {
    setPrevFiltersKey(filtersKey);
    setExtraPages([]);
    setLoadMoreError(false);
  }

  const lastPage = extraPages.length > 0 ? extraPages[extraPages.length - 1] : baseData;
  const hasMore = !!lastPage?.hasNextPage;

  const loadMore = async () => {
    if (!lastPage || isLoadingMore) {
      return;
    }

    setIsLoadingMore(true);
    setLoadMoreError(false);

    const nextFilters = { ...filters, page: lastPage.page + 1 };

    try {
      const data = await queryClient.fetchQuery({
        queryKey: queryKeys.posts.list(nextFilters),
        queryFn: () => fetchPostsFromApi(nextFilters),
        staleTime: 5 * 60 * 1000,
      });
      setExtraPages((prev) => [...prev, data]);
    } catch {
      setLoadMoreError(true);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const extraPosts: PostWithCompany[] = extraPages.flatMap((page) => page.posts);

  return { extraPosts, hasMore, isLoadingMore, loadMore, loadMoreError };
}
