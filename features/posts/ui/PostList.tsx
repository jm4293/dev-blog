import { PostWithCompany } from '@/supabase';
import { PostCard } from './PostCard';

interface PostListProps {
  posts: PostWithCompany[];
  isLoading?: boolean;
}

export const PostList = ({ posts, isLoading }: PostListProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gray-300 dark:bg-gray-600" />
              <div className="flex-1">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24 mb-2" />
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16" />
              </div>
            </div>
            <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-4" />
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded" />
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6" />
            </div>
            <div className="flex gap-2 mb-4">
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-full w-16" />
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-full w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400 text-lg">게시글이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};
