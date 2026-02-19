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
    <article className="glass-card transform rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <PostCardHeader logoUrl={post.company.logo_url} companyName={post.company.name} timeDisplay={timeDisplay}>
        <BookmarkButton
          isBookmarked={isBookmarked}
          isLoading={isLoading}
          onToggle={toggleBookmark}
          showLoginTooltip={showLoginTooltip}
        />
      </PostCardHeader>

      <Link
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handlePostClick}
        className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-1"
      >
        <h2 className="mb-3 line-clamp-2 text-lg font-bold text-foreground transition-colors hover:text-muted-foreground">
          {post.title}
        </h2>
      </Link>

      {post.summary && <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{post.summary}</p>}

      <PostCardTags tags={post.tags || []} />

      <Link
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handlePostClick}
        className="inline-flex items-center rounded text-sm font-semibold text-foreground underline-offset-2 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-1"
      >
        전체 읽기 →
      </Link>
    </article>
  );
}
