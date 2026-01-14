import { Metadata } from 'next';
import { BookmarkContainer } from '@/features/bookmarks';
import { getCurrentUser } from '@/supabase';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '내 즐겨찾기 | devBlog.kr',
  description: 'GitHub 로그인으로 저장한 기술 블로그 게시글을 한눈에 관리하고 정리하세요.',
  openGraph: {
    title: '내 즐겨찾기 | devBlog.kr',
    description: 'GitHub 로그인으로 저장한 기술 블로그 게시글을 한눈에 관리하세요.',
    type: 'website',
  },
};

export default async function BookmarksPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">즐겨찾기</h1>
        <p className="mb-8">내 정보를 보려면 로그인해야 합니다.</p>
        <Link href="/auth/login" className="mr-4 text-blue-600 hover:underline">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">로그인하러 가기</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">내 즐겨찾기</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">저장한 게시글을 확인해보세요.</p>
        <div className="mb-8"></div>

        <BookmarkContainer />
      </div>
    </div>
  );
}
