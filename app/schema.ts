import type { WithContext, Organization } from 'schema-dts';

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
  logo: `${baseUrl}/og-image.svg`,
  description: '한국 IT 기업들의 기술 블로그를 한 곳에서 모아보는 플랫폼',
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
  description: '한국 IT 기업들의 기술 블로그 수집 플랫폼',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${baseUrl}/?search={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
} as const;
