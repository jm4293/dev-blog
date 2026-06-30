import Link from 'next/link';
import { cn, formatPostDate } from '@/utils';
import { Check } from 'lucide-react';
import { useBookmarkToggle } from '@/features/bookmarks';
import { BookmarkButton, PostCardHeader, PostCardTags } from '@/features/posts';
import { useAddRecentView } from '@/features/recent-views';
import type { RecentViewWithPost } from '@/supabase/types.supabase';

interface RecentViewPostCardProps {
  view: RecentViewWithPost;
  isEditMode: boolean;
  isSelected: boolean;
  onSelect: (postId: string) => void;
  isBookmarked: boolean;
}

export function RecentViewPostCard({
  view,
  isEditMode,
  isSelected,
  onSelect,
  isBookmarked: isBookmarkedProp,
}: RecentViewPostCardProps) {
  const { isBookmarked, isLoading, toggleBookmark, showLoginTooltip } = useBookmarkToggle(
    view.post.id,
    isBookmarkedProp,
  );
  const addRecentView = useAddRecentView();
  const timeDisplay = formatPostDate(view.post.published_at);

  const handleCardClick = () => {
    if (isEditMode) {
      onSelect(view.post_id);
    }
  };

  const handleLinkClick = () => {
    if (!isEditMode) {
      addRecentView.mutate(view.post);
    }
  };

  return (
    <div className="group relative">
      {/* 선택 표시 - 편집 모드일 때만 */}
      {isEditMode && isSelected && (
        <div className="absolute right-4 top-4 z-10">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground shadow-lg">
            <Check className="h-5 w-5 text-background" strokeWidth={3} />
          </div>
        </div>
      )}

      {/* Post Card */}
      <article
        onClick={handleCardClick}
        className={cn(
          'glass-card rounded-xl p-6 transition-all',
          isEditMode
            ? isSelected
              ? 'cursor-pointer ring-2 ring-foreground'
              : 'cursor-pointer hover:bg-muted/60'
            : 'transform duration-300 hover:-translate-y-1 hover:shadow-lg',
        )}
      >
        <PostCardHeader
          logoUrl={view.post.company.logo_url}
          companyName={view.post.company.name}
          timeDisplay={timeDisplay}
        >
          {!isEditMode && (
            <BookmarkButton
              isBookmarked={isBookmarked}
              isLoading={isLoading}
              onToggle={(e) => {
                e.stopPropagation();
                toggleBookmark();
              }}
              showLoginTooltip={showLoginTooltip}
            />
          )}
        </PostCardHeader>

        {/* Title */}
        {isEditMode ? (
          <h3 className="mb-3 line-clamp-2 text-lg font-bold text-foreground">{view.post.title}</h3>
        ) : (
          <Link
            href={view.post.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleLinkClick}
            className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-1"
          >
            <h2 className="mb-3 line-clamp-2 text-lg font-bold text-foreground transition-colors hover:text-muted-foreground">
              {view.post.title}
            </h2>
          </Link>
        )}

        {/* Summary */}
        {view.post.summary && <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{view.post.summary}</p>}

        {/* Tags */}
        <PostCardTags tags={view.post.tags || []} />

        {/* Link Button - 편집 모드가 아닐 때만 */}
        {!isEditMode && (
          <Link
            href={view.post.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleLinkClick}
            className="inline-flex items-center rounded text-sm font-semibold text-foreground underline-offset-2 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-1"
          >
            전체 읽기 →
          </Link>
        )}
      </article>

      {/* Viewed At */}
      <p className="mt-2 text-xs text-muted-foreground">읽음: {new Date(view.viewed_at).toLocaleString('ko-KR')}</p>
    </div>
  );
}
