'use client';

import { useBookmarkToggle } from '@/features/bookmarks';
import { useAddRecentView } from '@/features/recent-views';
import type { PostWithCompany } from '@/supabase/types.supabase';

export function usePostCardInteractions(post: PostWithCompany, isBookmarked: boolean) {
  const bookmark = useBookmarkToggle(post.id, isBookmarked);
  const addRecentView = useAddRecentView();

  const handlePostClick = () => {
    addRecentView.mutate(post);
  };

  return {
    bookmark,
    handlePostClick,
  };
}
