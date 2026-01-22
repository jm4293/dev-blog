import { Metadata } from 'next';
import { BookmarkContainer } from '@/features/bookmarks';
import { getCurrentUser } from '@/supabase';
import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';

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

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 md:p-12 text-center shadow-lg">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">즐겨찾기</h1>

            <p className="text-base text-gray-600 dark:text-gray-400 mb-8">
              마음에 드는 게시글을 저장하고
              <br />
              나만의 개발 아카이브를 만들어보세요
            </p>

            <Link href="/auth/login">
              <button className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
                로그인하러 가기
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/posts"
              className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              게시글 둘러보기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">즐겨찾기</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">저장한 게시글을 확인해보세요.</p>
      </div>

      <BookmarkContainer isLoggedIn={!!user} />
    </div>
  );
}
