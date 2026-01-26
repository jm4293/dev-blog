import { PostWithCompany } from '@/supabase';
import { PostCard } from './PostCard';

interface PostListProps {
  posts: PostWithCompany[];
  isLoggedIn: boolean;
}

export function PostList({ posts, isLoggedIn }: PostListProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} isLoggedIn={isLoggedIn} />
      ))}
    </section>
  );
}
