import Link from 'next/link';
import { notFound } from 'next/navigation';
import { APP, slugify } from '@/utils';
import { Pagination } from '@/components/pagination';
import { fetchPosts } from '../services/fetch-posts';
import { findTagBySlug } from '../services/fetch-taxonomy';
import { PostList } from './post-list';

interface TagLandingProps {
  slug: string;
  page: number;
}

/** 태그 랜딩 페이지 본문 — /tags/[slug]와 /tags/[slug]/page/[page]가 공유 */
export async function TagLanding({ slug, page }: TagLandingProps) {
  const tag = await findTagBySlug(slug);

  if (!tag) {
    notFound();
  }

  const postsData = await fetchPosts({ tags: [tag.name], page, useStaticClient: true });

  // 범위를 벗어난 페이지는 404 (글이 아예 없는 태그의 1페이지는 빈 상태로 노출)
  if (page > 1 && postsData.posts.length === 0) {
    notFound();
  }

  const basePath = `/tags/${slugify(tag.name)}`;
  const canonicalUrl = `${APP.URL}${basePath}`;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: APP.URL },
      { '@type': 'ListItem', position: 2, name: '태그', item: `${APP.URL}/tags` },
      { '@type': 'ListItem', position: 3, name: tag.name, item: canonicalUrl },
    ],
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${tag.name} 기술 블로그 글 모음`,
    numberOfItems: postsData.total,
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    itemListElement: postsData.posts.map((post, index) => ({
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

      <header className="mb-6">
        <nav aria-label="브레드크럼" className="mb-2 text-sm text-muted-foreground">
          <Link href="/tags" className="transition-colors hover:text-foreground">
            태그
          </Link>
          <span className="mx-1">/</span>
          <span className="text-foreground">{tag.name}</span>
        </nav>
        <h1 className="text-2xl font-bold text-foreground md:text-4xl">{tag.name} 글 모음</h1>
        <p className="mt-2 text-muted-foreground">
          기업 기술블로그의 {tag.name} 관련 글 {postsData.total}개
        </p>
      </header>

      {/* data-nosnippet: 검색 스니펫에 게시글 목록이 발췌되지 않도록 제외 → meta description이 노출됨 */}
      <section aria-label={`${tag.name} 게시글 목록`} data-nosnippet="">
        {postsData.posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-lg font-semibold text-foreground">아직 등록된 글이 없습니다</p>
            <Link href="/posts" className="mt-3 text-sm text-muted-foreground underline-offset-2 hover:underline">
              전체 포스트 보기 →
            </Link>
          </div>
        ) : (
          <>
            <PostList posts={postsData.posts} />
            <Pagination
              currentPage={postsData.page}
              totalPages={postsData.totalPages}
              totalCount={postsData.total}
              baseUrl={basePath}
              usePathPagination
            />
          </>
        )}
      </section>
    </div>
  );
}
