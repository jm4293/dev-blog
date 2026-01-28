'use client';

import { useQuery } from '@tanstack/react-query';
import type { PostWithCompany } from '@/supabase/types.supabase';
import { buildQueryParams } from '@/utils';
import { queryKeys } from '@/lib/query-keys';

interface PostsParams {
  page?: number;
  search?: string;
  tagsString?: string;
  blogsString?: string;
  companyId?: string;
  sort?: 'newest' | 'oldest';
}

interface PostsResponse {
  posts: PostWithCompany[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export function usePosts({
  page = 1,
  search = '',
  tagsString = '',
  blogsString = '',
  companyId = '',
  sort = 'newest',
}: PostsParams = {}) {
  return useQuery<PostsResponse>({
    queryKey: queryKeys.posts.list({
      page,
      search,
      tags: tagsString ? tagsString.split(',') : [],
      blogs: blogsString ? blogsString.split(',') : [],
      companyId,
      sort,
    }),
    queryFn: async ({ signal }) => {
      const params = buildQueryParams({
        page,
        search,
        tags: tagsString,
        blogs: blogsString,
        company: companyId,
        sort: sort !== 'newest' ? sort : undefined,
      });

      const response = await fetch(`/api/posts?${params.toString()}`, {
        signal,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status}`);
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 30 * 60 * 1000, // 30분
  });
}
