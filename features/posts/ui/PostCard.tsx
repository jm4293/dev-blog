'use client';

import { PostWithCompany } from '@/supabase';
import Link from 'next/link';
import { BookmarkButton, PostCardHeader, PostCardTags } from '../components';
import { usePostCardInteractions } from '../hooks/usePostCardInteractions';
import { formatPostDate } from '@/utils';

interface PostCardProps {
  post: PostWithCompany;
  isLoggedIn: boolean;
}

export function PostCard({ post, isLoggedIn }: PostCardProps) {
  const { bookmark, handlePostClick } = usePostCardInteractions(post, isLoggedIn);
  const { isBookmarked, isLoading, toggleBookmark, showLoginTooltip } = bookmark;
  const timeDisplay = formatPostDate(post.published_at);

  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg dark:hover:shadow-xl transition-shadow hover:-translate-y-1 transform duration-300">
      <PostCardHeader logoUrl={post.company.logo_url} companyName={post.company.name} timeDisplay={timeDisplay}>
        <BookmarkButton
          isBookmarked={isBookmarked}
          isLoading={isLoading}
          onToggle={toggleBookmark}
          showLoginTooltip={showLoginTooltip}
        />
      </PostCardHeader>

      <Link href={post.url} target="_blank" rel="noopener noreferrer" onClick={handlePostClick}>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          {post.title}
        </h2>
      </Link>

      {post.summary && <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">{post.summary}</p>}

      <PostCardTags tags={post.tags || []} />

      <Link
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handlePostClick}
        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-semibold transition-colors"
      >
        전체 읽기 →
      </Link>
    </article>
  );
}
