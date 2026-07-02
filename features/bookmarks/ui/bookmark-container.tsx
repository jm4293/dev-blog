import { use } from 'react';
import { Heart } from 'lucide-react';
import { PostList } from '@/features/posts';
import { EmptyState } from '@/components/ui';
import { BookmarksResponse, groupBookmarksByMonth } from '../services';

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
        actionLabel="포스트 보러 가기 →"
        actionHref="/posts"
      />
    );
  }

  const groups = groupBookmarksByMonth(bookmarks);

  return (
    <div className="flex flex-col gap-8">
      {groups.map((group) => (
        <section key={group.label} aria-label={`${group.label} 저장한 글`}>
          <h2 className="mb-3 flex items-baseline gap-1.5 text-sm font-semibold text-muted-foreground">
            {group.label}
            <span className="font-normal">({group.bookmarks.length})</span>
          </h2>
          <PostList posts={group.bookmarks.map((bookmark) => bookmark.post)} />
        </section>
      ))}
    </div>
  );
}
