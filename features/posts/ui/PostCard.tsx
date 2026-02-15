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
    <article className="transform rounded-lg border border-gray-200 bg-white p-6 transition-shadow duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:shadow-xl">
      <PostCardHeader logoUrl={post.company.logo_url} companyName={post.company.name} timeDisplay={timeDisplay}>
        <BookmarkButton
          isBookmarked={isBookmarked}
          isLoading={isLoading}
          onToggle={toggleBookmark}
          showLoginTooltip={showLoginTooltip}
        />
      </PostCardHeader>

      <Link href={post.url} target="_blank" rel="noopener noreferrer" onClick={handlePostClick}>
        <h2 className="mb-3 line-clamp-2 text-lg font-bold text-gray-900 transition-colors hover:text-blue-600 dark:text-white dark:hover:text-blue-400">
          {post.title}
        </h2>
      </Link>

      {post.summary && <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">{post.summary}</p>}

      <PostCardTags tags={post.tags || []} />

      <Link
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handlePostClick}
        className="inline-flex items-center text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
      >
        전체 읽기 →
      </Link>
    </article>
  );
}
