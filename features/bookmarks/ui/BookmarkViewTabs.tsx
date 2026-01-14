'use client';

import { useState } from 'react';
import { BookmarkList } from './BookmarkList';
import { DateGridView } from './DateGridView';
import { LayoutGrid, Calendar } from 'lucide-react';
import { BookmarkWithPost } from '@/supabase';

interface BookmarkViewTabsProps {
  bookmarks: BookmarkWithPost[];
}

type ViewType = 'card' | 'date';

export const BookmarkViewTabs = ({ bookmarks }: BookmarkViewTabsProps) => {
  const [view, setView] = useState<ViewType>('card');

  return (
    <div className="space-y-6">
      {/* 탭 버튼 */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setView('card')}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
            view === 'card'
              ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}>
          <LayoutGrid className="w-5 h-5" />
          <span>전체</span>
        </button>

        <button
          onClick={() => setView('date')}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
            view === 'date'
              ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}>
          <Calendar className="w-5 h-5" />
          <span>날짜별</span>
        </button>
      </div>

      {/* 탭 콘텐츠 */}
      <div>
        {view === 'card' && <BookmarkList bookmarks={bookmarks} />}
        {view === 'date' && <DateGridView bookmarks={bookmarks} />}
      </div>
    </div>
  );
};
