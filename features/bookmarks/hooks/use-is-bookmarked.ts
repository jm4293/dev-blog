'use client';

import { useMemo } from 'react';
import { useBookmarksList } from './use-bookmarks-list';

export function useIsBookmarked() {
  const { data } = useBookmarksList();

  const bookmarkedSet = useMemo(() => new Set(data?.bookmarks?.map((b) => b.post_id)), [data?.bookmarks]);

  return (postId: string): boolean => {
    return bookmarkedSet.has(postId);
  };
}
