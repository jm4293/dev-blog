import type { WithContext, Organization, BreadcrumbList } from 'schema-dts';

export const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://devblog.kr';

/**
 * Organization 구조화된 데이터
 * 사이트의 조직 정보를 Google에 제공
 */
export const organizationSchema: WithContext<Organization> = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'devBlog.kr',
  url: baseUrl,
  logo: `${baseUrl}/og-image.png`,
  description: '개발 블로그를 한 곳에서 모아보는 플랫폼',
  sameAs: ['https://github.com/jm4293/dev-blog'],
};

/**
 * WebSite 구조화된 데이터
 * 검색 결과에 사이트 링크 검색창을 표시하기 위함
 */
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'devBlog.kr',
  url: baseUrl,
  description: '개발 블로그 수집 플랫폼',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${baseUrl}/?search={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
} as const;

/**
 * BreadcrumbList 구조화된 데이터 생성 함수
 * Google 검색 결과에 빵부스러기(경로) 표시
 *
 * @example
 * // 기본 포스트 페이지
 * createBreadcrumbSchema([
 *   { name: 'Home', url: 'https://devblog.kr' },
 *   { name: '포스트', url: 'https://devblog.kr/posts' }
 * ])
 *
 * // 태그 필터 페이지
 * createBreadcrumbSchema([
 *   { name: 'Home', url: 'https://devblog.kr' },
 *   { name: '포스트', url: 'https://devblog.kr/posts' },
 *   { name: 'React', url: 'https://devblog.kr/posts?tags=React' }
 * ])
 */
export function createBreadcrumbSchema(items: Array<{ name: string; url: string }>): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * CollectionPage 구조화된 데이터 생성 함수
 * 블로그 게시글 목록 페이지용
 */
export function createCollectionPageSchema(params: {
  name: string;
  description: string;
  url: string;
  numberOfItems?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: params.name,
    description: params.description,
    url: params.url,
    isPartOf: {
      '@type': 'WebSite',
      name: 'devBlog.kr',
      url: baseUrl,
    },
    ...(params.numberOfItems && {
      numberOfItems: params.numberOfItems,
    }),
  } as const;
}
