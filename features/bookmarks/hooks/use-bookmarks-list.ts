'use client';

import { useQuery } from '@tanstack/react-query';
import { useUser } from '@/features/auth';
import { queryKeys } from '@/lib/query-keys';
import { BookmarkWithPost } from '@/supabase/types.supabase';

export function useBookmarksList() {
  const { data: user } = useUser();

  return useQuery({
    queryKey: queryKeys.bookmarks.list(),
    // 비로그인 사용자는 항상 빈 목록이므로 요청 자체를 생략
    enabled: !!user,
    queryFn: async () => {
      const response = await fetch('/api/bookmarks');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch bookmarks');
      }

      return (await response.json()) as { bookmarks: BookmarkWithPost[] };
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 30 * 60 * 1000, // 30분
    retry: (failureCount, error) => {
      // 401 Unauthorized는 재시도 안 함 (로그인 필요)
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        return false;
      }
      // 최대 1회 재시도
      return failureCount < 1;
    },
  });
}
