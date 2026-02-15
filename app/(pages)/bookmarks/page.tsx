import { Metadata } from 'next';
import { BookmarkContainer } from '@/features/bookmarks';
import { fetchBookmarks } from '@/features/bookmarks/services';
import { APP } from '@/utils/constants';
import { getUser } from '@/features/auth';
import { Suspense } from 'react';
import { GridSkeleton } from '@/components/skeleton';
import { LoginRequired } from '@/components/auth';

export const metadata: Metadata = {
  title: '즐겨찾기',
  description:
    'GitHub 로그인으로 저장한 개발 블로그 게시글을 한눈에 관리하고 정리하세요. 토스, 카카오 등 개발 블로그를 북마크 하세요.',
  alternates: {
    canonical: `${APP.URL}/bookmarks`,
  },
  openGraph: {
    title: '즐겨찾기 - devBlog.kr',
    description: 'GitHub 로그인으로 저장한 개발 블로그 게시글을 한눈에 관리하세요.',
    url: `${APP.URL}/bookmarks`,
    siteName: 'devBlog.kr',
    type: 'website',
    locale: 'ko_KR',
    images: [
      {
        url: `${APP.URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: '즐겨찾기 - devBlog.kr',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '즐겨찾기 - devBlog.kr',
    description: 'GitHub 로그인으로 저장한 개발 블로그 게시글을 한눈에 관리하세요.',
    images: [`${APP.URL}/og-image.png`],
  },
};

export default async function BookmarksPage() {
  const user = await getUser();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <header className="mb-4">
          <h1 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white md:text-4xl">즐겨찾기</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">저장한 게시글을 확인해보세요.</p>
        </header>
        <LoginRequired description="GitHub 계정으로 로그인하고 즐겨찾기를 이용하세요" />
      </div>
    );
  }

  const bookmarksPromise = fetchBookmarks();

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-4">
        <h1 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white md:text-4xl">즐겨찾기</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">저장한 게시글을 확인해보세요.</p>
      </header>

      <section aria-label="북마크된 게시글 목록">
        <Suspense fallback={<GridSkeleton />}>
          <BookmarkContainer data={bookmarksPromise} isLoggedIn={!!user} />
        </Suspense>
      </section>
    </div>
  );
}
