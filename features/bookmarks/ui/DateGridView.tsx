'use client';

import { useMemo } from 'react';
import { PostCard } from '@/features/posts';
import { BookmarkWithPost } from '@/supabase';
import { EmptyState } from '@/components/ui/EmptyState';
import { EmptyLoginState } from './EmptyLoginState';
import { Heart } from 'lucide-react';

interface DateGridViewProps {
  bookmarks: BookmarkWithPost[];
  isLoggedIn: boolean;
}

interface BookmarksByDate {
  [date: string]: BookmarkWithPost[];
}

export const DateGridView = ({ bookmarks, isLoggedIn }: DateGridViewProps) => {
  // 날짜별로 북마크를 그룹화하고 정렬 (useMemo로 최적화)
  const { groupedByDate, sortedDates } = useMemo(() => {
    const grouped: BookmarksByDate = {};
    bookmarks.forEach((bookmark) => {
      const date = new Date(bookmark.created_at).toISOString().split('T')[0];
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(bookmark);
    });

    return {
      groupedByDate: grouped,
      sortedDates: Object.keys(grouped).sort().reverse(),
    };
  }, [bookmarks]);

  if (sortedDates.length === 0) {
    // 비로그인 상태일 때 - 날짜 헤더와 함께 빈 상태 표시
    if (!isLoggedIn) {
      return <EmptyLoginState />;
    }

    // 로그인 상태일 때
    return (
      <EmptyState
        icon={Heart}
        title="아직 북마크가 없습니다"
        description="마음에 드는 게시글에 하트 버튼을 클릭하여 저장하세요."
      />
    );
  }

  return (
    <div className="space-y-8">
      {sortedDates.map((date) => {
        const dateObj = new Date(date + 'T00:00:00');
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth() + 1;
        const day = dateObj.getDate();
        const dayName = dateObj.toLocaleDateString('ko-KR', { weekday: 'short' });

        const dayBookmarks = groupedByDate[date];

        return (
          <div key={date} className="space-y-4">
            <div className="sticky top-0 bg-white dark:bg-gray-900 z-10 py-3 px-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">{year}년</span>
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">{month}월</span>
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">{day}일</span>
                      <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">({dayName})</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 font-bold text-sm">
                    {dayBookmarks.length}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {dayBookmarks.map((bookmark) => (
                <PostCard key={bookmark.post.id} post={bookmark.post} isLoggedIn={isLoggedIn} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
