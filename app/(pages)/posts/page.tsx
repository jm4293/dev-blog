import type { Metadata } from 'next';
import { fetchPosts, PostsContainer } from '@/features/posts';
import { getUser } from '@/features/auth';
import { APP } from '@/utils/constants';

export const metadata: Metadata = {
  title: '포스트 - devBlog.kr',
  description:
    '토스, 카카오 등 개발 블로그 게시글을 한 곳에서 모아보세요. React, TypeScript, 백엔드, DevOps 등 최신 개발 정보를 태그와 검색으로 쉽게 찾아보세요.',
  alternates: {
    canonical: `${APP.URL}/posts`,
  },
  openGraph: {
    title: '포스트 - devBlog.kr',
    description: '토스, 카카오 등 개발 블로그 게시글을 한 곳에서 모아보세요.',
    url: `${APP.URL}/posts`,
    siteName: 'devBlog.kr',
    type: 'website',
    locale: 'ko_KR',
    images: [
      {
        url: `${APP.URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: '개발 블로그 모음 플랫폼 - devBlog.kr',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '포스트 - devBlog.kr',
    description: '토스, 카카오 등 개발 블로그 게시글을 한 곳에서 모아보세요.',
    images: [`${APP.URL}/og-image.png`],
  },
};

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    tags?: string;
    blogs?: string;
    sort?: string;
  }>;
}

export default async function PostPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const page = Math.max(1, parseInt(params.page || '1', 10));
  const search = params.search || '';
  const tags = params.tags || '';
  const blogs = params.blogs || '';
  const sort = (params.sort as 'newest' | 'oldest') || 'newest';

  const [user, postsData] = await Promise.all([getUser(), fetchPosts({ page, search, tags, blogs, sort })]);

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">devBlog.kr</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">개발 블로그를 한 곳에서 모아보세요.</p>
      </section>

      <PostsContainer
        isLoggedIn={!!user}
        initialData={postsData}
        initialFilters={{ page, search, tags, blogs, sort }}
      />
    </div>
  );
}
