'use client';

import { useIsBookmarked } from '@/features/bookmarks';
import { useViewedPostIds } from '@/features/recent-views';
import { PostWithCompany } from '@/supabase/types.supabase';
import { useNewPostThreshold } from '../hooks/use-new-post-threshold';
import { PostCard } from './post-card';

interface PostListProps {
  posts: PostWithCompany[];
}

export function PostList({ posts }: PostListProps) {
  // 북마크/읽음/새 글 여부는 리스트 레벨에서 한 번만 계산하여 카드별로 전달
  const isBookmarked = useIsBookmarked();
  const isViewed = useViewedPostIds();
  const newThreshold = useNewPostThreshold();

  const isNew = (post: PostWithCompany) =>
    newThreshold != null && post.published_at != null && new Date(post.published_at) > newThreshold;

  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          isBookmarked={isBookmarked(post.id)}
          isViewed={isViewed(post.id)}
          isNew={isNew(post)}
        />
      ))}
    </section>
  );
}
