import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  APP,
  buildPageMetadata,
  formatWeekLabel,
  getRecentWeeks,
  getWeekArticleDates,
  isFutureWeek,
  parseISOWeekString,
} from '@/utils';
import { DigestContent, fetchWeeklyDigest } from '@/features/digest';

interface PageProps {
  params: Promise<{ week: string }>;
}

export const revalidate = 3600; // 1시간 (지난 주차 데이터는 거의 변하지 않음)

export function generateStaticParams() {
  return getRecentWeeks(8).map((range) => ({ week: range.week }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { week } = await params;
  const range = parseISOWeekString(week);

  if (!range) {
    return { title: '주간 인기글을 찾을 수 없습니다' };
  }

  const label = formatWeekLabel(week);
  const { published, modified } = getWeekArticleDates(range);

  const meta = buildPageMetadata({
    title: `${label} 개발 블로그 인기 글 TOP 10`,
    description: `${label}에 한국 기업 기술 블로그에서 가장 인기 있었던 글을 모았습니다. 토스, 카카오, 네이버 등 32개 기업의 주간 하이라이트를 확인하세요.`,
    path: `/digest/${week}`,
    ogType: 'article',
  });

  // 발행/수정일 노출 (검색 결과의 'N일 전' 날짜 스니펫 신호)
  return {
    ...meta,
    openGraph: {
      ...meta.openGraph,
      type: 'article',
      publishedTime: published,
      modifiedTime: modified,
    },
  };
}

export default async function DigestWeekPage({ params }: PageProps) {
  const { week } = await params;
  const range = parseISOWeekString(week);

  // 잘못된 형식 또는 미래 주차는 404
  if (!range || isFutureWeek(range)) {
    notFound();
  }

  const digest = await fetchWeeklyDigest(range);
  const label = formatWeekLabel(week);
  const { published, modified } = getWeekArticleDates(range);

  // 발행일이 있는 콘텐츠성 페이지 — 검색 결과 날짜 스니펫('N일 전') 대상
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${label} 개발 블로그 인기 글 TOP 10`,
    datePublished: published,
    dateModified: modified,
    mainEntityOfPage: `${APP.URL}/digest/${week}`,
    author: { '@type': 'Organization', name: 'devBlog.kr', url: APP.URL },
    publisher: { '@type': 'Organization', name: 'devBlog.kr', url: APP.URL },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: APP.URL },
      { '@type': 'ListItem', position: 2, name: '주간 인기글', item: `${APP.URL}/digest` },
      { '@type': 'ListItem', position: 3, name: label, item: `${APP.URL}/digest/${week}` },
    ],
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${label} 개발 블로그 인기 글`,
    numberOfItems: digest.topPosts.length,
    itemListElement: digest.topPosts.map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: post.url,
      name: post.title,
    })),
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <header className="mb-8">
        <nav aria-label="브레드크럼" className="mb-2 text-sm text-muted-foreground">
          <Link href="/digest" className="transition-colors hover:text-foreground">
            주간 인기글
          </Link>
          <span className="mx-1">/</span>
          <span className="text-foreground">{label}</span>
        </nav>
        <h1 className="text-2xl font-bold text-foreground md:text-4xl">{label} 인기 글</h1>
        <p className="mt-2 text-muted-foreground">
          {range.start.getMonth() + 1}월 {range.start.getDate()}일 ~ {range.end.getMonth() + 1}월 {range.end.getDate()}
          일 · 새 글 {digest.totalCount}개
        </p>
      </header>

      {digest.totalCount === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-lg font-semibold text-foreground">이 주에는 수집된 글이 없습니다</p>
          <Link href="/digest" className="mt-3 text-sm text-muted-foreground underline-offset-2 hover:underline">
            다른 주차 보기 →
          </Link>
        </div>
      ) : (
        <DigestContent digest={digest} />
      )}
    </div>
  );
}
