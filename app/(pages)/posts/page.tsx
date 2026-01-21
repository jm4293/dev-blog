import { Suspense } from 'react';
import type { Metadata } from 'next';
import { GridSkeleton } from '@/components/skeleton';
import { PostsContainer } from '@/features/posts';
import { getCurrentUser } from '@/supabase/getCurrentUser';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://devblog.kr';

export const metadata: Metadata = {
  title: '개발 블로그 | 기술 블로그 - devBlog.kr',
  description:
    '토스, 카카오 등 한국 IT 기업들의 기술 블로그 게시글을 한 곳에서 모아보세요. React, TypeScript, 백엔드, DevOps 등 최신 개발 정보를 태그와 검색으로 쉽게 찾아보세요.',
  keywords: [
    '개발 블로그',
    '개발블로그',
    '기술 블로그',
    '기술블로그',
    '포스트',
    'React',
    'TypeScript',
    '백엔드',
    'DevOps',
    'Database',
  ],
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: '개발 블로그 | 기술 블로그 - devBlog.kr',
    description: '토스, 카카오 등 한국 IT 기업들의 기술 블로그 게시글을 한 곳에서 모아보세요.',
    type: 'website',
    url: baseUrl,
    locale: 'ko_KR',
  },
};

export default async function PostPage() {
  const user = await getCurrentUser();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">devBlog.kr</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">한국 기업들의 기술 블로그를 한 곳에서 모아보세요.</p>
      </div>

      <Suspense fallback={<GridSkeleton />}>
        <PostsContainer isLoggedIn={!!user} />
      </Suspense>
    </div>
  );
}
