'use client';

import { useQuery } from '@tanstack/react-query';
import { ANNOUNCEMENTS } from '@/utils/constants';
import type { AnnouncementsResponse } from '@/supabase';
import { queryKeys } from '@/lib/query-keys';

interface UseAnnouncementsOptions {
  page?: number;
  limit?: number;
}

/**
 * 공지사항 조회 훅
 */
export function useAnnouncements({ page = 1, limit = ANNOUNCEMENTS.ITEMS_PER_PAGE }: UseAnnouncementsOptions = {}) {
  return useQuery({
    queryKey: queryKeys.announcements.list({ page, limit }),
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      const response = await fetch(`/api/announcements?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch announcements');
      }
      return response.json() as Promise<AnnouncementsResponse>;
    },
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분 (이전 cacheTime)
  });
}
