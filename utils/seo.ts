import type { Metadata } from 'next';
import { APP } from './constants';

/**
 * OG 이미지 명시 참조
 *
 * app/opengraph-image.tsx 파일 컨벤션은 페이지가 자체 openGraph를 정의하면
 * (Next의 metadata 병합이 openGraph를 통째로 교체하므로) og:image가 사라진다.
 * 따라서 페이지 metadata는 반드시 이 헬퍼를 통해 images를 명시해야 한다.
 */
const OG_IMAGE = {
  url: '/opengraph-image', // metadataBase 기준 절대 URL로 변환됨
  width: 1200,
  height: 630,
  alt: '기술블로그 모음 — devBlog.kr',
};

const TWITTER_IMAGE = '/twitter-image';

interface BuildPageMetadataInput {
  /** 페이지 제목 (루트 template이 '- devBlog.kr'를 붙임) */
  title: string;
  description: string;
  /** canonical 경로 (예: '/terms', '/tags/react') */
  path: string;
  ogType?: 'website' | 'article';
}

/**
 * JSON-LD 안전 직렬화
 *
 * JSON.stringify는 `</script>` 시퀀스를 이스케이프하지 않아, 외부 RSS에서 수집한
 * 제목에 해당 문자열이 들어오면 인라인 스크립트를 조기 종료시켜 XSS로 이어질 수 있다.
 * JSON-LD를 dangerouslySetInnerHTML에 넣을 때는 반드시 이 함수를 거쳐야 한다.
 */
export function serializeJsonLd(schema: unknown): string {
  return JSON.stringify(schema)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

/** 페이지 공통 metadata 생성 — canonical, OG(이미지 포함), 트위터 카드 */
export function buildPageMetadata({ title, description, path, ogType = 'website' }: BuildPageMetadataInput): Metadata {
  const fullTitle = `${title} - devBlog.kr`;
  const url = `${APP.URL}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      // 페이지 단위 alternates가 루트 설정을 대체하므로 RSS 자동탐지 링크를 함께 유지
      types: {
        'application/rss+xml': `${APP.URL}/feed.xml`,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: 'devBlog.kr',
      type: ogType,
      locale: 'ko_KR',
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [TWITTER_IMAGE],
    },
  };
}
