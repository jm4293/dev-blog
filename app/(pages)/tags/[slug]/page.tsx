import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { APP, buildPageMetadata, findBySlug, slugify } from '@/utils';
import { fetchAllTags, fetchPosts, PostList } from '@/features/posts';
import { Pagination } from '@/components/pagination';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}

export const revalidate = 3600; // 1시간

export async function generateStaticParams() {
  const tags = await fetchAllTags();
  return tags.map((tag) => ({ slug: slugify(tag.name) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tags = await fetchAllTags();
  const tag = findBySlug(tags, slug, (t) => t.name);

  if (!tag) {
    return { title: '태그를 찾을 수 없습니다' };
  }

  return buildPageMetadata({
    title: `${tag.name} 기술 블로그 글 모음`,
    description: `한국 기업 기술 블로그의 ${tag.name} 관련 글 ${tag.usage_count}개를 모았습니다. 토스, 카카오, 네이버 등 32개 기업의 ${tag.name} 최신 글을 한 곳에서 확인하세요.`,
    path: `/tags/${slugify(tag.name)}`,
  });
}

export default async function TagPage({ params, searchParams }: PageProps) {
  const [{ slug }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const page = Math.max(1, parseInt(resolvedSearchParams.page || '1', 10) || 1);

  const tags = await fetchAllTags();
  const tag = findBySlug(tags, slug, (t) => t.name);

  if (!tag) {
    notFound();
  }

  const postsData = await fetchPosts({ tags: [tag.name], page });
  const canonicalUrl = `${APP.URL}/tags/${slugify(tag.name)}`;

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
          한국 기업 기술 블로그의 {tag.name} 관련 글 {postsData.total}개
        </p>
      </header>

      <section aria-label={`${tag.name} 게시글 목록`}>
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
              baseUrl={`/tags/${slugify(tag.name)}`}
            />
          </>
        )}
      </section>
    </div>
  );
}
