import type { Metadata } from 'next';
import { APP, parsePostsSearchParams } from '@/utils';
import { fetchPosts, PostsContainer } from '@/features/posts';

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export const revalidate = 1800; // 30분 = 1800초

export async function generateMetadata(): Promise<Metadata> {
  const title = '개발/기술 블로그 모음';
  const description =
    '매일 자동 업데이트되는 토스, 카카오 등 32+ 기업의 최신 개발 블로그를 검색하고 태그별 필터링으로 원하는 기술 글을 빠르게 찾아보세요. 마음에 드는 글은 즐겨찾기에 저장하세요.';
  const canonicalUrl = `${APP.URL}/posts`;
  const fullTitle = `${title} - devBlog.kr`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    keywords: [
      '개발 블로그',
      '개발블로그',
      '개발 블로그 모음',
      '개발블로그 모음',
      '기술 블로그',
      '기술블로그',
      '기술 블로그 모음',
      '기술블로그 모음',
      '테크 블로그',
      '테크블로그',
      '테크 블로그 모음',
      '테크블로그 모음',
      '한국 개발 블로그',
      '한국 기술 블로그',
      '한국 테크 블로그',
      '개발자 블로그',
    ],
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: 'devBlog.kr',
      type: 'website',
      locale: 'ko_KR',
      images: [
        {
          url: `${APP.URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: '개발/기술 블로그 모음 플랫폼 - devBlog.kr',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [`${APP.URL}/og-image.png`],
    },
  };
}

export default async function PostPage({ searchParams }: PageProps) {
  const { page, search, tags, blogs, sort, login, error } = parsePostsSearchParams(await searchParams);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: APP.URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: '포스트',
        item: `${APP.URL}/posts`,
      },
    ],
  };

  const postsData = await fetchPosts({ page, search, tags, blogs, sort });

  return (
    <div className="container mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <header className="mb-4">
        <h1 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white md:text-4xl">
          <span className="sr-only">개발블로그·기술블로그 모음 - </span>
          포스트
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          <span className="sr-only">
            매일 자동 업데이트되는 토스, 카카오 등 32개 기업의 최신 개발 블로그를 검색하고 태그별 필터링으로 원하는 기술
            글을 빠르게 찾아보세요.
          </span>
          매일 업데이트되는 최신 개발 블로그를 검색하고, 마음에 드는 글은 즐겨찾기에 저장하세요.
        </p>
      </header>

      <section aria-label="블로그 게시글 목록">
        <PostsContainer
          initialData={postsData}
          initialFilters={{ page, search, tags, blogs, sort }}
          loginStatus={login}
          errorStatus={error}
        />
      </section>
    </div>
  );
}
