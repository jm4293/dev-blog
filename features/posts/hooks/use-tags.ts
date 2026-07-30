'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import type { Tag } from '@/supabase/types.supabase';

interface TagsResponse {
  tags: Tag[];
  total: number;
}

interface UseTagsOptions {
  featured?: boolean;
  category?: string;
  sort?: 'name' | 'usage' | 'featured';
  /** false면 요청을 보류 (예: 필터 모달이 열리기 전까지) */
  enabled?: boolean;
}

export function useTags({ featured = false, category = '', sort = 'usage', enabled = true }: UseTagsOptions = {}) {
  return useQuery<TagsResponse>({
    queryKey: queryKeys.tags.list({ featured, category, sort }),
    enabled,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (featured) params.set('featured', 'true');
      if (category) params.set('category', category);
      if (sort) params.set('sort', sort);

      const response = await fetch(`/api/tags${params.toString() ? `?${params.toString()}` : ''}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch tags: ${response.status}`);
      }

      return response.json();
    },
    staleTime: 60 * 60 * 1000, // 1시간 (태그 목록은 거의 안 바뀜)
    gcTime: 2 * 60 * 60 * 1000, // 2시간
  });
}
