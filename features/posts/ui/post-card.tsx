'use client';

import { usePostCardInteractions } from '@/hooks';
import { cn, formatPostDate } from '@/utils';
import { PostWithCompany } from '@/supabase/types.supabase';
import { BookmarkButton } from './bookmark-button';
import { PostCardHeader } from './post-card-header';
import { PostCardTags } from './post-card-tags';

interface PostCardProps {
  post: PostWithCompany;
  isBookmarked: boolean;
  /** 최근 본 글 기록에 있는 글 — 재방문 시 이미 읽은 글을 구분할 수 있게 표시 */
  isViewed?: boolean;
  /** 마지막 방문 이후 발행된 글 — NEW 뱃지 표시 (읽은 글에는 표시하지 않음) */
  isNew?: boolean;
}

export function PostCard({ post, isBookmarked: isBookmarkedProp, isViewed = false, isNew = false }: PostCardProps) {
  const { bookmark, handlePostClick } = usePostCardInteractions(post, isBookmarkedProp);
  const { isBookmarked, isLoading, toggleBookmark, showLoginTooltip, loginUrl } = bookmark;
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
            loginUrl={loginUrl}
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
        <h2
          className={cn(
            'mb-3 line-clamp-2 text-lg font-bold leading-snug',
            isViewed ? 'text-muted-foreground' : 'text-foreground',
          )}
        >
          {isViewed ? (
            <span className="mr-2 inline-block -translate-y-0.5 rounded bg-muted px-1.5 py-0.5 align-middle text-xs font-medium text-muted-foreground">
              읽음
            </span>
          ) : (
            isNew && (
              <span className="mr-2 inline-block -translate-y-0.5 rounded bg-foreground px-1.5 py-0.5 align-middle text-xs font-semibold text-background">
                NEW
              </span>
            )
          )}
          {post.title}
        </h2>
      </a>

      {post.summary && (
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{post.summary}</p>
      )}

      <PostCardTags tags={post.tags || []} />
    </article>
  );
}
