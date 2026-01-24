import { Metadata } from 'next';
import { BookmarkContainer } from '@/features/bookmarks';
import { getCurrentUser } from '@/supabase';
import { APP } from '@/utils/constants';

export const metadata: Metadata = {
  title: '즐겨찾기 | 개발 블로그 저장 관리 - devBlog.kr',
  description:
    'GitHub 로그인으로 저장한 기술 블로그 게시글을 한눈에 관리하고 정리하세요. 토스, 카카오 등 한국 IT 기업의 개발 블로그를 북마크 하세요.',
  alternates: {
    canonical: `${APP.URL}/bookmarks`,
  },
  openGraph: {
    title: '즐겨찾기 | 개발 블로그 저장 관리 - devBlog.kr',
    description: 'GitHub 로그인으로 저장한 기술 블로그 게시글을 한눈에 관리하세요.',
    url: `${APP.URL}/bookmarks`,
    siteName: 'devBlog.kr',
    type: 'website',
    locale: 'ko_KR',
    images: [
      {
        url: `${APP.URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: '즐겨찾기 | devBlog.kr',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '즐겨찾기 | 개발 블로그 저장 관리 - devBlog.kr',
    description: 'GitHub 로그인으로 저장한 기술 블로그 게시글을 한눈에 관리하세요.',
    images: [`${APP.URL}/og-image.png`],
  },
};

export default async function BookmarksPage() {
  const user = await getCurrentUser();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">즐겨찾기</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {user ? '저장한 게시글을 확인해보세요.' : '로그인하고 관심있는 게시글을 저장하세요.'}
        </p>
      </div>

      <BookmarkContainer isLoggedIn={!!user} />
    </div>
  );
}
