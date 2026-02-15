'use client';

import { PostCard } from '@/features/posts';
import { BookmarkWithPost } from '@/supabase';

interface BookmarkListProps {
  bookmarks: BookmarkWithPost[];
  isLoggedIn: boolean;
}

export const BookmarkList = ({ bookmarks, isLoggedIn }: BookmarkListProps) => {
  if (bookmarks.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-gray-600 dark:text-gray-400">아직 즐겨찾기한 게시글이 없습니다.</p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
          마음에 드는 게시글에 하트 버튼을 클릭하여 저장하세요.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {bookmarks.map((bookmark) => (
        <PostCard key={bookmark.post.id} post={bookmark.post} isLoggedIn={isLoggedIn} />
      ))}
    </div>
  );
};
