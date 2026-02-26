import { PostWithCompany } from '@/supabase/types.supabase';
import { PostCard } from './post-card';

interface PostListProps {
  posts: PostWithCompany[];
}

export function PostList({ posts }: PostListProps) {
  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </section>
  );
}
