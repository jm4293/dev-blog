import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import Link from 'next/link';
import { PostWithCompany } from '@/types/post';

interface PostCardProps {
  post: PostWithCompany;
}

export const PostCard = ({ post }: PostCardProps) => {
  const relativeTime = formatDistanceToNow(new Date(post.published_at), {
    addSuffix: true,
    locale: ko,
  });

  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg dark:hover:shadow-xl transition-shadow hover:-translate-y-1 transform duration-300">
      {/* Company Info */}
      <div className="flex items-center gap-3 mb-4">
        {post.company.logo_url && (
          <img src={post.company.logo_url} alt={post.company.name} className="w-10 h-10 rounded-lg object-cover" />
        )}
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{post.company.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{relativeTime}</p>
        </div>
      </div>

      {/* Title */}
      <Link href={post.url} target="_blank" rel="noopener noreferrer">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
          {post.title}
        </h3>
      </Link>

      {/* Summary */}
      {post.summary && <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">{post.summary}</p>}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-full">
              {tag}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium rounded-full">
              +{post.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Link Button */}
      <Link
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-semibold transition-colors">
        전체 읽기 →
      </Link>
    </article>
  );
};
