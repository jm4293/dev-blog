import { Suspense } from 'react';
import { Metadata } from 'next';
import { buildPageMetadata } from '@/utils';
import { BookmarkContainer, BookmarkCount, fetchBookmarks } from '@/features/bookmarks';
import { GridSkeleton } from '@/components/skeleton';

export const metadata: Metadata = buildPageMetadata({
  title: '즐겨찾기',
  description:
    '토스, 카카오, 네이버 등 32개 기업 기술블로그·개발블로그에서 마음에 든 글을 저장하고 한눈에 다시 보세요. GitHub 로그인으로 무료 사용.',
  path: '/bookmarks',
});

export default async function BookmarksPage() {
  const bookmarksPromise = fetchBookmarks();

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-foreground md:text-4xl">
          즐겨찾기
          <Suspense>
            <BookmarkCount data={bookmarksPromise} />
          </Suspense>
        </h1>
      </header>

      <section aria-label="북마크된 게시글 목록">
        <Suspense fallback={<GridSkeleton />}>
          <BookmarkContainer data={bookmarksPromise} />
        </Suspense>
      </section>
    </div>
  );
}
