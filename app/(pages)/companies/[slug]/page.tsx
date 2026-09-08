import type { Metadata } from 'next';
import { buildPageMetadata } from '@/utils';
import { CompanyLanding, companySlug, fetchActiveCompanies, findCompanyBySlug } from '@/features/posts';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 86400; // 1일 (새 글이 저장된 회사는 수집 스크립트가 즉시 갱신 — ISR Write 절감)

export async function generateStaticParams() {
  const companies = await fetchActiveCompanies();
  return companies.map((company) => ({ slug: companySlug(company) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const company = await findCompanyBySlug(slug);

  if (!company) {
    return { title: '기업을 찾을 수 없습니다' };
  }

  return buildPageMetadata({
    title: `${company.name} 기술 블로그 최신 글`,
    description: `${company.name} 기술 블로그의 최신 글을 모았습니다.${
      company.description ? ` ${company.description}` : ''
    }`,
    path: `/companies/${companySlug(company)}`,
  });
}

export default async function CompanyPage({ params }: PageProps) {
  const { slug } = await params;

  return <CompanyLanding slug={slug} page={1} />;
}
