'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import type { Company } from '@/supabase/types.supabase';

interface BlogsResponse {
  companies: Company[];
  total: number;
}

interface UseBlogsOptions {
  featured?: boolean;
  all?: boolean;
}

export function useBlogs({ featured = false, all = false }: UseBlogsOptions = {}) {
  return useQuery<BlogsResponse>({
    queryKey: queryKeys.blogs.list({ featured, all }),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (featured) params.set('featured', 'true');
      if (all) params.set('all', 'true');

      const response = await fetch(`/api/companies${params.toString() ? `?${params.toString()}` : ''}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch companies: ${response.status}`);
      }

      return response.json();
    },
    staleTime: 30 * 60 * 1000, // 30분 (블로그 정보는 자주 변하지 않음)
    gcTime: 1 * 60 * 60 * 1000, // 1시간
  });
}
