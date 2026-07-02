'use client';

import { useBookmarkToggle } from '@/features/bookmarks';
import { useAddRecentView } from '@/features/recent-views';
import { createSupabaseClient } from '@/supabase/client.supabase';
import type { PostWithCompany } from '@/supabase/types.supabase';

export function usePostCardInteractions(post: PostWithCompany, isBookmarked: boolean) {
  const bookmark = useBookmarkToggle(post.id, isBookmarked);
  const addRecentView = useAddRecentView();

  const handlePostClick = () => {
    addRecentView.mutate(post);

    // 조회수 기록 (트렌딩 집계용) — 실패해도 사용자 경험에 영향 없음
    const supabase = createSupabaseClient();
    void supabase.rpc('increment_post_view', { p_post_id: post.id }).then(
      () => undefined,
      () => undefined,
    );
  };

  return {
    bookmark,
    handlePostClick,
  };
}
