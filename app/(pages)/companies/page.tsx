import type { Metadata } from 'next';
import Link from 'next/link';
import { APP, buildPageMetadata, slugify } from '@/utils';
import { fetchActiveCompanies } from '@/features/posts';
import { BlogLogoImage } from '@/components/image';

export const revalidate = 3600; // 1시간

export const metadata: Metadata = buildPageMetadata({
  title: '기업별 기술 블로그 모음',
  description: '기업 기술블로그를 회사별로 모아보세요.',
  path: '/companies',
});

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: APP.URL },
    { '@type': 'ListItem', position: 2, name: '기업', item: `${APP.URL}/companies` },
  ],
};

export default async function CompaniesPage() {
  const companies = await fetchActiveCompanies();

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <header className="mb-8">
        <h1 className="text-2xl font-bold text-foreground md:text-4xl">기업별 모아보기</h1>
        <p className="mt-2 text-muted-foreground">{companies.length}개 기업의 기술 블로그를 회사별로 모아보세요.</p>
      </header>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {companies.map((company) => (
          <li key={company.id}>
            <Link
              href={`/companies/${slugify(company.name_en || company.name)}`}
              className="flex h-full items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <BlogLogoImage logoUrl={company.logo_url} companyName={company.name} width={40} height={40} />
              <div className="min-w-0">
                <p className="truncate font-semibold text-foreground">{company.name}</p>
                {company.description && <p className="truncate text-xs text-muted-foreground">{company.description}</p>}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
