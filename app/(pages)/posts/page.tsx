import { Suspense } from 'react';
import type { Metadata } from 'next';
import { PostsContainer } from '@/features/posts';

export const metadata: Metadata = {
  title: '포스트 | devBlog',
  description:
    '토스, 카카오 등 한국 IT 기업들의 기술 블로그 게시글을 한 곳에서 모아보세요. React, TypeScript, 백엔드, DevOps 등 최신 개발 정보를 태그와 검색으로 쉽게 찾아보세요.',
  openGraph: {
    description: '토스, 카카오 등 한국 IT 기업들의 기술 블로그 게시글을 한 곳에서 모아보세요.',
    type: 'website',
  },
};

function PostsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 animate-pulse"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gray-300 dark:bg-gray-600" />
            <div className="flex-1">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24 mb-2" />
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16" />
            </div>
          </div>
          <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-4" />
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded" />
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6" />
          </div>
          <div className="flex gap-2 mb-4">
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-full w-16" />
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-full w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PostPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">devBlog.kr</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">한국 기업들의 기술 블로그를 한 곳에서 모아보세요.</p>
      </div>

      <Suspense fallback={<PostsLoading />}>
        <PostsContainer />
      </Suspense>
    </div>
  );
}
