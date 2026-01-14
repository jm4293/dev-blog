'use client';

import { PostCard } from '@/features/posts';
import { BookmarkWithPost } from '@/supabase';

interface DateGridViewProps {
  bookmarks: BookmarkWithPost[];
}

interface BookmarksByDate {
  [date: string]: BookmarkWithPost[];
}

export const DateGridView = ({ bookmarks }: DateGridViewProps) => {
  // 날짜별로 북마크를 그룹화 (YYYY-MM-DD)
  const groupedByDate: BookmarksByDate = {};
  bookmarks.forEach((bookmark) => {
    const date = new Date(bookmark.created_at).toISOString().split('T')[0];
    if (!groupedByDate[date]) {
      groupedByDate[date] = [];
    }
    groupedByDate[date].push(bookmark);
  });

  // 날짜를 내림차순으로 정렬
  const sortedDates = Object.keys(groupedByDate).sort().reverse();

  if (sortedDates.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400 text-lg">아직 북마크가 없습니다.</p>
        <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
          마음에 드는 게시글에 하트 버튼을 클릭하여 저장하세요.
        </p>
      </div>
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
            {/* 날짜 헤더 */}
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
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 dark:bg-blue-500 text-white font-bold text-lg">
                    {dayBookmarks.length}
                  </span>
                </div>
              </div>
            </div>

            {/* 날짜별 게시글 그리드 */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {dayBookmarks.map((bookmark) => (
                <PostCard key={bookmark.post.id} post={bookmark.post} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
