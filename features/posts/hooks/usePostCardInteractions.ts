'use client';

import { useBookmarkToggle } from '@/features/bookmarks';
import { useAddRecentView } from '@/features/recent-views';
import { PostWithCompany } from '@/supabase';

export function usePostCardInteractions(post: PostWithCompany, isLoggedIn: boolean) {
  const bookmark = useBookmarkToggle(post.id, isLoggedIn);
  const addRecentView = useAddRecentView(isLoggedIn);

  const handlePostClick = () => {
    addRecentView.mutate(post);
  };

  return {
    bookmark,
    handlePostClick,
  };
}
