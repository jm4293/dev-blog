import { Check } from 'lucide-react';
import Link from 'next/link';
import type { RecentViewWithPost } from '@/supabase/types.supabase';
import { useAddRecentView } from '@/features/recent-views';
import { formatPostDate, cn } from '@/utils';
import { PostCardHeader, PostCardTags, BookmarkButton } from '@/features/posts/components';
import { useBookmarkToggle } from '@/features/bookmarks';

interface RecentViewPostCardProps {
  view: RecentViewWithPost;
  isEditMode: boolean;
  isSelected: boolean;
  isLoggedIn: boolean;
  onSelect: (postId: string) => void;
}

export function RecentViewPostCard({ view, isEditMode, isSelected, isLoggedIn, onSelect }: RecentViewPostCardProps) {
  const { isBookmarked, isLoading, toggleBookmark, showLoginTooltip } = useBookmarkToggle(view.post.id, isLoggedIn);
  const addRecentView = useAddRecentView(isLoggedIn);
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
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 shadow-lg">
            <Check className="h-5 w-5 text-white" />
          </div>
        </div>
      )}

      {/* Post Card */}
      <article
        onClick={handleCardClick}
        className={cn(
          'rounded-lg border-2 bg-white p-6 transition-all dark:bg-gray-800',
          isEditMode
            ? isSelected
              ? 'cursor-pointer border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/30'
              : 'cursor-pointer border-gray-200 hover:border-blue-400 dark:border-gray-700 dark:hover:border-blue-600'
            : 'transform border-gray-200 duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:hover:shadow-xl',
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
          <h3 className="mb-3 line-clamp-2 text-lg font-bold text-gray-900 dark:text-white">{view.post.title}</h3>
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
        {view.post.summary && (
          <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">{view.post.summary}</p>
        )}

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
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        조회: {new Date(view.viewed_at).toLocaleString('ko-KR')}
      </p>
    </div>
  );
}
