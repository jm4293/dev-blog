import { Suspense } from 'react';
import type { Metadata } from 'next';
import { APP, buildPageMetadata } from '@/utils';
import { fetchPosts, fetchTrendingPosts, PostsContainer, PostsFallback, TrendingSection } from '@/features/posts';

export const revalidate = 1800; // 30분 (새 글 수집 시 /api/revalidate로 즉시 갱신)

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

export const metadata: Metadata = buildPageMetadata({
  title: '기술블로그 모음',
  description: '여러 기업 기술블로그의 새 글을 한 곳에서 확인하세요. 태그와 회사별로 골라볼 수 있습니다.',
  path: '/posts',
});

export default async function PostPage() {
  // 정적 생성: 기본 목록(1페이지)과 인기 글을 빌드/ISR 시점에 조회
  // 검색·필터·페이지 이동은 클라이언트에서 /api/posts로 조회한다
  const [postsData, trendingPosts] = await Promise.all([
    fetchPosts({ useStaticClient: true }),
    fetchTrendingPosts({ limit: 3 }),
  ]);

  const trendingSlot = trendingPosts.length > 0 ? <TrendingSection posts={trendingPosts} /> : null;

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: '기술블로그 모음',
    description: '32개 기업 기술블로그의 최신 글 목록',
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
          <span className="sr-only">기술블로그 모음 — 여러 기업의 새 글을 한 곳에서 보여드립니다.</span>
          포스트
        </h1>
      </header>

      <section aria-label="블로그 게시글 목록">
        {/* useSearchParams를 쓰는 컨테이너는 정적 페이지에서 Suspense 필수.
            fallback이 곧 정적 HTML이 되므로 스켈레톤 대신 실제 콘텐츠를 렌더링한다. */}
        <Suspense fallback={<PostsFallback initialData={postsData} trendingSlot={trendingSlot} />}>
          <PostsContainer initialData={postsData} trendingSlot={trendingSlot} />
        </Suspense>
      </section>
    </div>
  );
}
