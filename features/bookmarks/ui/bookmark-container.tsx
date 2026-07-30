'use client';

import { Heart } from 'lucide-react';
import { PostList } from '@/features/posts';
import { GridSkeleton } from '@/components/skeleton';
import { EmptyState } from '@/components/ui';
import { useBookmarksList } from '../hooks';
import { groupBookmarksByMonth } from '../services';

/**
 * 즐겨찾기 목록 (클라이언트)
 *
 * 페이지에서 하이드레이션된 쿼리 캐시를 사용하므로 첫 렌더부터 목록/하트가 채워지고,
 * 하트 해제 시 낙관적 캐시 갱신으로 카드와 개수가 즉시 사라진다.
 */
export function BookmarkContainer() {
  const { data, isPending, isError, refetch } = useBookmarksList();

  if (isPending) {
    return <GridSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg font-semibold text-foreground">즐겨찾기를 불러오지 못했습니다</p>
        <p className="mt-2 text-muted-foreground">일시적인 오류일 수 있습니다. 잠시 후 다시 시도해주세요.</p>
        <button
          onClick={() => refetch()}
          className="mt-4 rounded-lg bg-foreground px-4 py-2 font-semibold text-background transition-opacity hover:opacity-90"
        >
          다시 시도
        </button>
      </div>
    );
  }

  const bookmarks = data?.bookmarks ?? [];

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
