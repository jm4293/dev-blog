'use client';

import { useQuery } from '@tanstack/react-query';
import type { PostWithCompany } from '@/supabase/types.supabase';

interface PostsParams {
  page?: number;
  search?: string;
  tagsString?: string;
  companiesString?: string;
  companyId?: string;
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
  companiesString = '',
  companyId = '',
}: PostsParams = {}) {
  return useQuery<PostsResponse>({
    queryKey: ['posts', page, search, tagsString, companiesString, companyId],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      if (search) params.set('search', search);
      if (tagsString) params.set('tags', tagsString);
      if (companiesString) params.set('companies', companiesString);
      if (companyId) params.set('company', companyId);

      const response = await fetch(`/api/posts?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status}`);
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 30 * 60 * 1000, // 30분
  });
}
