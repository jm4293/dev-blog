'use client';

import { GridSkeleton } from '@/components/skeleton';
import { useBookmarksList } from '../hooks/useBookmarksList';
import { BookmarkViewTabs } from './BookmarkViewTabs';

export function BookmarkContainer() {
  const { data, isLoading, error } = useBookmarksList();
  const bookmarks = data?.bookmarks || [];

  return (
    <>
      <div className="mb-8">
        {bookmarks.length > 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
            총 <span className="font-semibold">{bookmarks.length}</span>개의 게시글이 저장되어 있습니다.
          </p>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-800 dark:text-red-300 rounded-lg">
          <p className="font-semibold">오류가 발생했습니다</p>
          <p className="text-sm mt-1">{error.message}</p>
        </div>
      )}

      {isLoading ? <GridSkeleton /> : <BookmarkViewTabs bookmarks={bookmarks} />}
    </>
  );
}
