import { use } from 'react';
import { Heart } from 'lucide-react';
import { PostList } from '@/features/posts';
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

  return <PostList posts={bookmarks.map((bookmark) => bookmark.post)} />;
}
