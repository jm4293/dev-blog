import type { Metadata } from 'next';
import { APP, parsePostsSearchParams } from '@/utils';
import { fetchPosts, PostsContainer } from '@/features/posts';

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export const revalidate = 1800; // 30분 = 1800초

// 요청과 무관한 정적 스키마는 모듈 스코프에서 1회만 생성
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

export async function generateMetadata(): Promise<Metadata> {
  const title = '개발블로그·기술블로그 모음';
  const description =
    '토스, 카카오, 네이버 등 32개 기업의 개발블로그·기술블로그·테크블로그를 한 곳에서. 매일 두 번 자동 수집되는 최신 글을 검색하고 태그별로 필터링하세요.';
  const canonicalUrl = `${APP.URL}/posts`;
  const fullTitle = `${title} - devBlog.kr`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: 'devBlog.kr',
      type: 'website',
      locale: 'ko_KR',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
    },
  };
}

export default async function PostPage({ searchParams }: PageProps) {
  const { page, search, tags, blogs, sort, login, error } = parsePostsSearchParams(await searchParams);

  const postsData = await fetchPosts({ page, search, tags, blogs, sort });

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: '개발블로그·기술블로그 모음',
    description: '한국 32개 기업의 최신 개발자 블로그 글 목록',
    numberOfItems: postsData.total,
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    itemListElement: postsData.posts.slice(0, 20).map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: post.url,
      name: post.title,
    })),
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListSchema),
        }}
      />

      <header className="mb-6">
        <h1 className="text-2xl font-bold text-foreground md:text-4xl">
          <span className="sr-only">
            한국 개발블로그·기술블로그·테크블로그 모음 — 토스, 카카오, 네이버, 우아한형제들 등 32개 기업의 최신 개발자
            블로그 글을 매일 자동 수집하여 한 곳에서 보여드립니다. Frontend, Backend, DevOps, AI/ML 등 카테고리별 검색
            가능.
          </span>
          포스트
        </h1>
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
