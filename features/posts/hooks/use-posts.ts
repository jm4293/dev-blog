'use client';

import { buildQueryParams } from '@/utils';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import type { GetPostsResponse } from '../services/fetch-posts';

export interface PostsFilters {
  page: number;
  search: string;
  tags: string[];
  blogs: string[];
  sort: 'newest' | 'oldest';
}

/** 필터가 정적 페이지의 기본 상태(1페이지, 필터 없음)와 같은지 */
export function isDefaultFilters(filters: PostsFilters): boolean {
  return (
    filters.page === 1 &&
    filters.search === '' &&
    filters.tags.length === 0 &&
    filters.blogs.length === 0 &&
    filters.sort === 'newest'
  );
}

/**
 * 게시글 목록 조회 훅
 * 기본 상태는 정적 페이지가 내려준 initialData를 그대로 쓰고,
 * 필터/페이지가 바뀌면 /api/posts에서 클라이언트 조회한다.
 */
export function usePosts(filters: PostsFilters, initialData: GetPostsResponse) {
  return useQuery<GetPostsResponse>({
    queryKey: queryKeys.posts.list(filters),
    queryFn: async () => {
      const params = buildQueryParams({
        page: filters.page > 1 ? filters.page : undefined,
        search: filters.search || undefined,
        tags: filters.tags.length > 0 ? filters.tags.join(',') : undefined,
        blogs: filters.blogs.length > 0 ? filters.blogs.join(',') : undefined,
        sort: filters.sort !== 'newest' ? filters.sort : undefined,
      });

      const response = await fetch(`/api/posts${params.toString() ? `?${params.toString()}` : ''}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status}`);
      }

      return response.json();
    },
    initialData: isDefaultFilters(filters) ? initialData : undefined,
    staleTime: 5 * 60 * 1000, // 5분 (ISR 30분과 별개로 클라이언트 캐시)
    placeholderData: keepPreviousData, // 페이지 이동 시 이전 목록 유지 (깜빡임 방지)
  });
}
