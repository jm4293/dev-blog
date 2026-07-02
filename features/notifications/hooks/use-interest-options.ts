'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import type { Company, Tag } from '@/supabase/types.supabase';

/**
 * 관심사 선택 UI용 태그/회사 목록 조회
 * (features 간 직접 의존 금지 규칙 때문에 posts의 훅을 재사용하지 않고 동일한 query key로 캐시를 공유한다)
 */

interface TagsResponse {
  tags: Tag[];
  total: number;
}

type CompanyOption = Pick<Company, 'id' | 'name' | 'logo_url'>;

interface CompaniesResponse {
  companies: CompanyOption[];
  total: number;
}

export function useInterestTagOptions() {
  return useQuery<TagsResponse>({
    queryKey: queryKeys.tags.list({ featured: false, category: '', sort: 'usage' }),
    queryFn: async () => {
      const response = await fetch('/api/tags?sort=usage');
      if (!response.ok) {
        throw new Error(`Failed to fetch tags: ${response.status}`);
      }
      return response.json();
    },
    staleTime: 60 * 60 * 1000, // 1시간
    gcTime: 2 * 60 * 60 * 1000,
  });
}

export function useInterestCompanyOptions() {
  return useQuery<CompaniesResponse>({
    queryKey: queryKeys.blogs.list({ featured: false, all: true }),
    queryFn: async () => {
      const response = await fetch('/api/companies?all=true');
      if (!response.ok) {
        throw new Error(`Failed to fetch companies: ${response.status}`);
      }
      return response.json();
    },
    staleTime: 30 * 60 * 1000, // 30분
    gcTime: 60 * 60 * 1000,
  });
}
