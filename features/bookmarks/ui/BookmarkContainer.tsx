'use client';

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

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : (
        <BookmarkViewTabs bookmarks={bookmarks} />
      )}
    </>
  );
}
