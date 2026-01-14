import { Suspense } from 'react';
import { PostsContainer } from '@/features/posts';

export const metadata = {
  title: '포스트 | devBlog.kr',
  description: '한국 개발 기업들의 기술 블로그 게시글을 한 곳에서 모아보세요.',
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
