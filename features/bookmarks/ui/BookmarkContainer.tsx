'use client';

import { BookmarkSkeleton } from '@/components/skeleton';
import { useBookmarksList } from '../hooks/useBookmarksList';
import { DateGridView } from './DateGridView';

export function BookmarkContainer({ isLoggedIn }: { isLoggedIn: boolean }) {
  const { data, isLoading, error } = useBookmarksList();
  const bookmarks = data?.bookmarks || [];

  return (
    <>
      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-800 dark:text-red-300 rounded-lg">
          <p className="font-semibold">오류가 발생했습니다</p>
          <p className="text-sm mt-1">{error.message}</p>
        </div>
      )}

      {isLoading ? <BookmarkSkeleton /> : <DateGridView bookmarks={bookmarks} isLoggedIn={isLoggedIn} />}
    </>
  );
}
