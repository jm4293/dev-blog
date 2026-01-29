import { Metadata } from 'next';
import { BookmarkContainer } from '@/features/bookmarks';
import { fetchBookmarks } from '@/features/bookmarks/services';
import { APP } from '@/utils/constants';
import { getUser } from '@/features/auth';
import { LogIn, UserIcon } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { GridSkeleton } from '@/components/skeleton';

export const metadata: Metadata = {
  title: '즐겨찾기 - devBlog.kr',
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
        <header className="mb-12">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">즐겨찾기</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">저장한 게시글을 확인해보세요.</p>
        </header>
        <section className="max-w-2xl mx-auto">
          <article className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
                <UserIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">로그인이 필요합니다</h2>
              <p className="text-gray-600 dark:text-gray-400">GitHub 계정으로 로그인하고 프로필 정보를 확인하세요</p>
            </div>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              <LogIn className="w-5 h-5" />
              GitHub로 로그인
            </Link>
          </article>
        </section>
      </div>
    );
  }

  const bookmarksPromise = fetchBookmarks();

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">즐겨찾기</h1>
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
