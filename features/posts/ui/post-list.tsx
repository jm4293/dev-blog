'use client';

import { useIsBookmarked } from '@/features/bookmarks';
import { PostWithCompany } from '@/supabase/types.supabase';
import { PostCard } from './post-card';

interface PostListProps {
  posts: PostWithCompany[];
}

export function PostList({ posts }: PostListProps) {
  // 북마크 여부는 리스트 레벨에서 한 번만 계산하여 카드별로 전달
  const isBookmarked = useIsBookmarked();

  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} isBookmarked={isBookmarked(post.id)} />
      ))}
    </section>
  );
}
