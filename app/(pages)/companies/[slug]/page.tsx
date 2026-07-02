import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { APP, buildPageMetadata, findBySlug, slugify } from '@/utils';
import { fetchActiveCompanies, fetchPosts, PostList } from '@/features/posts';
import { BlogLogoImage } from '@/components/image';
import { Pagination } from '@/components/pagination';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}

export const revalidate = 3600; // 1시간

function companySlug(company: { name: string; name_en?: string }): string {
  return slugify(company.name_en || company.name);
}

export async function generateStaticParams() {
  const companies = await fetchActiveCompanies();
  return companies.map((company) => ({ slug: companySlug(company) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const companies = await fetchActiveCompanies();
  const company = findBySlug(companies, slug, companySlug);

  if (!company) {
    return { title: '기업을 찾을 수 없습니다' };
  }

  return buildPageMetadata({
    title: `${company.name} 기술 블로그 최신 글`,
    description: `${company.name} 기술 블로그의 최신 글을 모았습니다. ${
      company.description ? `${company.description} ` : ''
    }devBlog.kr에서 ${company.name}의 개발 이야기를 한 곳에서 확인하세요.`,
    path: `/companies/${companySlug(company)}`,
  });
}

export default async function CompanyPage({ params, searchParams }: PageProps) {
  const [{ slug }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const page = Math.max(1, parseInt(resolvedSearchParams.page || '1', 10) || 1);

  const companies = await fetchActiveCompanies();
  const company = findBySlug(companies, slug, companySlug);

  if (!company) {
    notFound();
  }

  const postsData = await fetchPosts({ companyId: company.id, page });
  const canonicalUrl = `${APP.URL}/companies/${companySlug(company)}`;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: APP.URL },
      { '@type': 'ListItem', position: 2, name: '기업', item: `${APP.URL}/companies` },
      { '@type': 'ListItem', position: 3, name: company.name, item: canonicalUrl },
    ],
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${company.name} 기술 블로그 글 모음`,
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
          <Link href="/companies" className="transition-colors hover:text-foreground">
            기업
          </Link>
          <span className="mx-1">/</span>
          <span className="text-foreground">{company.name}</span>
        </nav>

        <div className="flex items-center gap-4">
          <BlogLogoImage logoUrl={company.logo_url} companyName={company.name} width={56} height={56} priority />
          <div>
            <h1 className="text-2xl font-bold text-foreground md:text-4xl">{company.name} 기술 블로그</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              총 {postsData.total}개 글 ·{' '}
              <a
                href={company.blog_url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-2 hover:underline"
              >
                원본 블로그 방문 →
              </a>
            </p>
          </div>
        </div>
        {company.description && <p className="mt-3 text-muted-foreground">{company.description}</p>}
      </header>

      <section aria-label={`${company.name} 게시글 목록`}>
        {postsData.posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-lg font-semibold text-foreground">아직 수집된 글이 없습니다</p>
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
              baseUrl={`/companies/${companySlug(company)}`}
            />
          </>
        )}
      </section>
    </div>
  );
}
