'use client';

import { useBookmarksList } from './use-bookmarks-list';

export const useIsBookmarked = () => {
  const { data } = useBookmarksList();

  return (postId: string): boolean => {
    return data?.bookmarks?.some((b) => b.post_id === postId) ?? false;
  };
};
