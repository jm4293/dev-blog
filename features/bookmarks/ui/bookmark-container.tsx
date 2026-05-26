import { use } from 'react';
import { Heart } from 'lucide-react';
import { PostCard } from '@/features/posts';
import { EmptyState } from '@/components/ui';
import { BookmarksResponse } from '../services';

interface BookmarkContainerProps {
  data: Promise<BookmarksResponse>;
}

export function BookmarkContainer({ data }: BookmarkContainerProps) {
  const { bookmarks } = use(data);

  if (bookmarks.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="아직 북마크가 없습니다"
        description="마음에 드는 게시글에 하트 버튼을 클릭하여 저장하세요."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {bookmarks.map((bookmark) => (
        <PostCard key={bookmark.post.id} post={bookmark.post} />
      ))}
    </div>
  );
}
