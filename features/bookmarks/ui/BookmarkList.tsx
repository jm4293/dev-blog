'use client';

import { PostCard } from '@/features/posts';
import { BookmarkWithPost } from '@/supabase';

interface BookmarkListProps {
  bookmarks: BookmarkWithPost[];
}

export const BookmarkList = ({ bookmarks }: BookmarkListProps) => {
  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400 text-lg">아직 즐겨찾기한 게시글이 없습니다.</p>
        <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
          마음에 드는 게시글에 하트 버튼을 클릭하여 저장하세요.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {bookmarks.map((bookmark) => (
        <PostCard key={bookmark.post.id} post={bookmark.post} />
      ))}
    </div>
  );
};
