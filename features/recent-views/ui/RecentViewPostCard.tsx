import { Check } from 'lucide-react';
import Link from 'next/link';
import type { RecentViewWithPost } from '@/supabase/types.supabase';
import { useAddRecentView } from '@/features/recent-views';
import { formatPostDate } from '@/utils';
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
    <div className="relative group">
      {/* 선택 표시 - 편집 모드일 때만 */}
      {isEditMode && isSelected && (
        <div className="absolute top-4 right-4 z-10">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
            <Check className="w-5 h-5 text-white" />
          </div>
        </div>
      )}

      {/* Post Card */}
      <article
        onClick={handleCardClick}
        className={`bg-white dark:bg-gray-800 rounded-lg border-2 p-6 transition-all ${
          isEditMode
            ? isSelected
              ? 'border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-950/30 cursor-pointer'
              : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 cursor-pointer'
            : 'border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-xl hover:-translate-y-1 transform duration-300'
        }`}
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
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">{view.post.title}</h3>
        ) : (
          <Link href={view.post.url} target="_blank" rel="noopener noreferrer" onClick={handleLinkClick}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {view.post.title}
            </h3>
          </Link>
        )}

        {/* Summary */}
        {view.post.summary && (
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">{view.post.summary}</p>
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
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-semibold transition-colors"
          >
            전체 읽기 →
          </Link>
        )}
      </article>

      {/* Viewed At */}
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        조회: {new Date(view.viewed_at).toLocaleString('ko-KR')}
      </p>
    </div>
  );
}
