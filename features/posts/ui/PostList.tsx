import { GridSkeleton } from '@/components/skeleton';
import { PostWithCompany } from '@/supabase';
import { PostCard } from './PostCard';

interface PostListProps {
  posts: PostWithCompany[];
  isLoading?: boolean;
}

export function PostList({ posts, isLoading }: PostListProps) {
  if (isLoading) {
    return <GridSkeleton />;
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400 text-lg">게시글이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
