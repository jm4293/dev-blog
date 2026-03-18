'use client';

import { useState } from 'react';
import { useUser } from '@/features/auth';
import { useAddBookmark, useIsBookmarked, useRemoveBookmark } from './index';

export function useBookmarkToggle(postId: string) {
  const { data: user } = useUser();
  const isLoggedIn = !!user;

  const addBookmarkMutation = useAddBookmark();
  const removeBookmarkMutation = useRemoveBookmark();
  const isBookmarkedFn = useIsBookmarked();

  const isBookmarked = isBookmarkedFn(postId);
  const isLoading = addBookmarkMutation.isPending || removeBookmarkMutation.isPending;

  const [showLoginTooltip, setShowLoginTooltip] = useState(false);

  const toggleBookmark = () => {
    if (!isLoggedIn) {
      setShowLoginTooltip(true);
      setTimeout(() => setShowLoginTooltip(false), 2000);
      return;
    }

    if (isBookmarked) {
      removeBookmarkMutation.mutate(postId);
    } else {
      addBookmarkMutation.mutate(postId);
    }
  };

  return {
    isBookmarked,
    isLoading,
    toggleBookmark,
    showLoginTooltip,
  };
}
