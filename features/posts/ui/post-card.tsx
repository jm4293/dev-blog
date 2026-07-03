'use client';

import { usePostCardInteractions } from '@/hooks';
import { formatPostDate } from '@/utils';
import { PostWithCompany } from '@/supabase/types.supabase';
import { BookmarkButton } from './bookmark-button';
import { PostCardHeader } from './post-card-header';
import { PostCardTags } from './post-card-tags';

interface PostCardProps {
  post: PostWithCompany;
  isBookmarked: boolean;
}

export function PostCard({ post, isBookmarked: isBookmarkedProp }: PostCardProps) {
  const { bookmark, handlePostClick } = usePostCardInteractions(post, isBookmarkedProp);
  const { isBookmarked, isLoading, toggleBookmark, showLoginTooltip } = bookmark;
  const timeDisplay = formatPostDate(post.published_at);

  return (
    <article className="glass-card relative transform rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <PostCardHeader logoUrl={post.company.logo_url} companyName={post.company.name} timeDisplay={timeDisplay}>
        {/* 카드 전체가 링크이므로 하트 버튼은 z-index로 위에 띄워 별도 동작 */}
        <div className="relative z-10">
          <BookmarkButton
            isBookmarked={isBookmarked}
            isLoading={isLoading}
            onToggle={toggleBookmark}
            showLoginTooltip={showLoginTooltip}
          />
        </div>
      </PostCardHeader>

      {/* 제목 링크의 after 오버레이가 카드 전체를 덮어 어디를 눌러도 원본 글로 이동 */}
      <a
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handlePostClick}
        aria-label={`${post.title} — 원본 글 읽기`}
        className="after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-foreground/30"
      >
        <h2 className="mb-3 line-clamp-2 text-lg font-bold leading-snug text-foreground">{post.title}</h2>
      </a>

      {post.summary && (
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{post.summary}</p>
      )}

      <PostCardTags tags={post.tags || []} />
    </article>
  );
}
