import { Suspense } from 'react';
import type { Metadata } from 'next';
import { PostsFetcher } from '@/features/posts';
import { getUser } from '@/features/auth';
import { APP, parsePostsSearchParams } from '@/utils';
import { createSupabaseServerClient } from '@/supabase/server.supabase';
import { GridSkeleton } from '@/components/skeleton';

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

/**
 * 동적 메타데이터 생성
 * 쿼리 파라미터에 따라 SEO 최적화된 메타데이터를 생성합니다.
 */
export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const { search, tags, blogs } = parsePostsSearchParams(params);

  // 기본 메타데이터
  let title = '개발 블로그 모음';
  let description = '토스, 카카오 등 32개 기업의 개발 블로그 게시글을 한 곳에서 모아보세요.';
  let canonicalUrl = `${APP.URL}/posts`;

  // 검색어가 있는 경우
  if (search) {
    title = `"${search}" 검색 결과`;
    description = `"${search}" 관련 개발 블로그 게시글을 찾아보세요. 토스, 카카오 등 한국 주요 IT 기업의 기술 블로그에서 검색한 결과입니다.`;
    canonicalUrl = `${APP.URL}/posts?search=${encodeURIComponent(search)}`;
  }

  // 태그 필터가 있는 경우
  if (tags && tags.length > 0) {
    const tagNames = tags.join(', ');
    title = `${tagNames} 개발 블로그 모음`;
    description = `${tagNames} 관련 최신 기술 블로그 글 모음. 토스, 카카오 등 32개 기업의 ${tagNames} 개발 경험과 노하우를 한 곳에서 확인하세요.`;
    canonicalUrl = `${APP.URL}/posts?tags=${tags.map(encodeURIComponent).join(',')}`;
  }

  // 회사 필터가 있는 경우
  if (blogs && blogs.length > 0) {
    try {
      const supabase = await createSupabaseServerClient();
      const { data: companies } = await supabase.from('companies').select('name').in('id', blogs).limit(3);

      if (companies && companies.length > 0) {
        const companyNames = companies.map((c) => c.name).join(', ');
        title = `${companyNames} 기술 블로그`;
        description = `${companyNames}의 최신 기술 블로그 글을 모아보세요. 실무 개발 인사이트와 기술 스택을 확인할 수 있습니다.`;
        canonicalUrl = `${APP.URL}/posts?companies=${blogs.map(encodeURIComponent).join(',')}`;
      }
    } catch (error) {}
  }

  // 검색어 + 태그 조합
  if (search && tags && tags.length > 0) {
    const tagNames = tags.join(', ');
    title = `"${search}" ${tagNames} 검색 결과`;
    description = `"${search}" 키워드로 ${tagNames} 관련 개발 블로그 글을 검색한 결과입니다.`;
  }

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
      ...(tags || []),
      ...(search ? [search] : []),
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
          alt: '개발 블로그 모음 플랫폼 - devBlog.kr',
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

  const user = await getUser();

  // Breadcrumb 스키마 생성 (SEO)
  const breadcrumbItems = [{ name: 'Home', url: APP.URL }];

  if (search) {
    breadcrumbItems.push(
      { name: '포스트', url: `${APP.URL}/posts` },
      { name: `"${search}" 검색`, url: `${APP.URL}/posts?search=${encodeURIComponent(search)}` },
    );
  } else if (tags && tags.length > 0) {
    breadcrumbItems.push(
      { name: '포스트', url: `${APP.URL}/posts` },
      { name: tags.join(', '), url: `${APP.URL}/posts?tags=${tags.map(encodeURIComponent).join(',')}` },
    );
  } else if (blogs && blogs.length > 0) {
    breadcrumbItems.push(
      { name: '포스트', url: `${APP.URL}/posts` },
      { name: '회사별 필터', url: `${APP.URL}/posts?companies=${blogs.map(encodeURIComponent).join(',')}` },
    );
  } else {
    breadcrumbItems.push({ name: '포스트', url: `${APP.URL}/posts` });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb 구조화된 데이터 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: breadcrumbItems.map((item, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: item.name,
              item: item.url,
            })),
          }),
        }}
      />

      <header className="mb-4">
        <h1 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white md:text-4xl">포스트</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">개발 블로그를 한 곳에서 모아보세요.</p>
      </header>

      <section aria-label="블로그 게시글 목록">
        <Suspense fallback={<GridSkeleton count={8} />}>
          <PostsFetcher
            isLoggedIn={!!user}
            page={page}
            search={search}
            tags={tags}
            blogs={blogs}
            sort={sort}
            loginStatus={login}
            errorStatus={error}
          />
        </Suspense>
      </section>
    </div>
  );
}
