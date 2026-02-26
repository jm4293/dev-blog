'use client';

import { useBookmarkToggle } from '@/features/bookmarks';
import { useAddRecentView } from '@/features/recent-views';
import type { PostWithCompany } from '@/supabase/types.supabase';

export function usePostCardInteractions(post: PostWithCompany) {
  const bookmark = useBookmarkToggle(post.id);
  const addRecentView = useAddRecentView();

  const handlePostClick = () => {
    addRecentView.mutate(post);
  };

  return {
    bookmark,
    handlePostClick,
  };
}
