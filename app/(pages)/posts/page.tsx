import { Suspense } from 'react';
import type { Metadata } from 'next';
import { GridSkeleton } from '@/components/skeleton';
import { PostsContainer } from '@/features/posts';
import { getCurrentUser } from '@/supabase/getCurrentUser';
import { APP } from '@/utils/constants';

export const metadata: Metadata = {
  title: '개발 블로그 | 기술 블로그 - devBlog.kr',
  description:
    '토스, 카카오 등 한국 IT 기업들의 기술 블로그 게시글을 한 곳에서 모아보세요. React, TypeScript, 백엔드, DevOps 등 최신 개발 정보를 태그와 검색으로 쉽게 찾아보세요.',
  alternates: {
    canonical: `${APP.URL}/posts`,
  },
  openGraph: {
    title: '개발 블로그 | 기술 블로그 - devBlog.kr',
    description: '토스, 카카오 등 한국 IT 기업들의 기술 블로그 게시글을 한 곳에서 모아보세요.',
    url: `${APP.URL}/posts`,
    siteName: 'devBlog.kr',
    type: 'website',
    locale: 'ko_KR',
    images: [
      {
        url: `${APP.URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: '개발 블로그 | 기술 블로그 모음 플랫폼',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '개발 블로그 | 기술 블로그 - devBlog.kr',
    description: '토스, 카카오 등 한국 IT 기업들의 기술 블로그 게시글을 한 곳에서 모아보세요.',
    images: [`${APP.URL}/og-image.png`],
  },
};

export default async function PostPage() {
  const user = await getCurrentUser();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">devBlog.kr</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">한국 기업들의 기술 블로그를 한 곳에서 모아보세요.</p>
      </div>

      <Suspense fallback={<GridSkeleton />}>
        <PostsContainer isLoggedIn={!!user} />
      </Suspense>
    </div>
  );
}
