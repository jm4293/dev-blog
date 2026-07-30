import { Metadata } from 'next';
import { buildPageMetadata } from '@/utils';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { BookmarkContainer, BookmarkCount, fetchBookmarks } from '@/features/bookmarks';
import { queryKeys } from '@/lib/query-keys';

export const metadata: Metadata = buildPageMetadata({
  title: '즐겨찾기',
  description: '기업 기술블로그에서 마음에 든 글을 저장하고 한눈에 다시 보세요.',
  path: '/bookmarks',
});

export default async function BookmarksPage() {
  // 서버에서 1회 조회한 결과를 클라이언트 쿼리 캐시로 하이드레이션한다.
  // 기존 use(promise) 방식은 목록 안의 하트(useBookmarksList)가 같은 데이터를
  // /api/bookmarks로 한 번 더 조회해 총 2회 요청 + 하트 늦게 채워짐 문제가 있었다.
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: queryKeys.bookmarks.list(),
    queryFn: fetchBookmarks,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-foreground md:text-4xl">
            즐겨찾기
            <BookmarkCount />
          </h1>
        </header>

        <section aria-label="북마크된 게시글 목록">
          <BookmarkContainer />
        </section>
      </HydrationBoundary>
    </div>
  );
}
