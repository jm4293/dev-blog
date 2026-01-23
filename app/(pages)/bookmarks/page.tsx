import { Metadata } from 'next';
import { BookmarkContainer } from '@/features/bookmarks';
import { getCurrentUser } from '@/supabase';

export const metadata: Metadata = {
  title: '즐겨찾기 | 개발 블로그 저장 관리 - devBlog.kr',
  description:
    'GitHub 로그인으로 저장한 기술 블로그 게시글을 한눈에 관리하고 정리하세요. 토스, 카카오 등 한국 IT 기업의 개발 블로그를 북마크 하세요.',
  keywords: ['즐겨찾기', '북마크', '개발 블로그', '기술 블로그', '저장'],
  openGraph: {
    title: '즐겨찾기 | 개발 블로그 저장 관리 - devBlog.kr',
    description: 'GitHub 로그인으로 저장한 기술 블로그 게시글을 한눈에 관리하세요.',
    type: 'website',
  },
};

export default async function BookmarksPage() {
  const user = await getCurrentUser();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">즐겨찾기</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {user
            ? '저장한 게시글을 확인해보세요.'
            : '마음에 드는 게시글을 저장하고 나만의 개발 아카이브를 만들어보세요.'}
        </p>
      </div>

      <BookmarkContainer isLoggedIn={!!user} />
    </div>
  );
}
