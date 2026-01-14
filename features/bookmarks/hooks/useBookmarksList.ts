'use client';

import { useQuery } from '@tanstack/react-query';
import { BookmarkWithPost } from '@/supabase';

export const useBookmarksList = () => {
  return useQuery({
    queryKey: ['bookmarks'],
    queryFn: async () => {
      const response = await fetch('/api/bookmarks');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch bookmarks');
      }

      return (await response.json()) as { bookmarks: BookmarkWithPost[] };
    },
  });
};
