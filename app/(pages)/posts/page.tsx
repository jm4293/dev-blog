import { PostsContainer } from '@/features/posts';
import { Suspense } from 'react';

export default function PostPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">devBlog.kr</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            한국 개발 기업들의 기술 블로그를 한 곳에서 모아보세요.
          </p>
        </div>

        <PostsContainer />
      </div>
    </Suspense>
  );
}
