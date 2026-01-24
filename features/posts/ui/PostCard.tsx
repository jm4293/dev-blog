'use client';

import { PostWithCompany } from '@/supabase';
import Link from 'next/link';
import { useBookmarkToggle } from '@/features/bookmarks';
import { useTrackView } from '@/features/recent-views';
import { BookmarkButton, PostCardHeader, PostCardTags } from '@/features/posts';
import { formatPostDate } from '@/utils';

interface PostCardProps {
  post: PostWithCompany;
  isLoggedIn: boolean;
}

export function PostCard({ post, isLoggedIn }: PostCardProps) {
  const { isBookmarked, isLoading, toggleBookmark, showLoginTooltip } = useBookmarkToggle(post.id, isLoggedIn);
  const trackView = useTrackView(isLoggedIn);
  const timeDisplay = formatPostDate(post.published_at);

  const handleClick = () => {
    trackView.mutate(post);
  };

  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg dark:hover:shadow-xl transition-shadow hover:-translate-y-1 transform duration-300">
      <PostCardHeader
        logoUrl={post.company.logo_url}
        companyName={post.company.name}
        timeDisplay={timeDisplay}
        bookmarkButton={
          <BookmarkButton
            isBookmarked={isBookmarked}
            isLoading={isLoading}
            onToggle={toggleBookmark}
            showLoginTooltip={showLoginTooltip}
          />
        }
      />

      {/* Title */}
      <Link href={post.url} target="_blank" rel="noopener noreferrer" onClick={handleClick}>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          {post.title}
        </h3>
      </Link>

      {/* Summary */}
      {post.summary && <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">{post.summary}</p>}

      {/* Tags */}
      <PostCardTags tags={post.tags || []} />

      {/* Link Button */}
      <Link
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-semibold transition-colors"
      >
        전체 읽기 →
      </Link>
    </article>
  );
}
