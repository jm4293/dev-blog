import { Suspense } from 'react';
import type { Metadata } from 'next';
import { PostsContainer } from '@/features/posts';

export const metadata: Metadata = {
  title: 'devBlog.kr - 한국 개발 기업 블로그 모음',
  description: '토스, 카카오 등 한국 IT 기업들의 기술 블로그 게시글을 한 곳에서 모아보세요. React, TypeScript, 백엔드, DevOps 등 최신 개발 정보를 태그와 검색으로 쉽게 찾아보세요.',
  openGraph: {
    title: 'devBlog.kr - 한국 개발 기업 블로그 모음',
    description: '토스, 카카오 등 한국 IT 기업들의 기술 블로그 게시글을 한 곳에서 모아보세요.',
    type: 'website',
  },
};

function PostsLoading() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="mb-4 inline-block">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
        <p className="text-gray-600 dark:text-gray-400">게시글을 불러오는 중입니다...</p>
      </div>
    </div>
  );
}

export default function PostPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">devBlog.kr</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">기업들의 기술 블로그를 한 곳에서 모아보세요.</p>
      </div>

      <Suspense fallback={<PostsLoading />}>
        <PostsContainer />
      </Suspense>
    </div>
  );
}
