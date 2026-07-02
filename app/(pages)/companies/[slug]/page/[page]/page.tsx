import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { buildPageMetadata } from '@/utils';
import { CompanyLanding, companySlug, findCompanyBySlug } from '@/features/posts';

interface PageProps {
  params: Promise<{ slug: string; page: string }>;
}

export const revalidate = 3600; // 1시간 (첫 요청 시 생성 후 ISR 캐시)

// 페이지 번호는 요청 시점에 생성
export function generateStaticParams() {
  return [];
}

function parsePage(raw: string): number | null {
  if (!/^\d+$/.test(raw)) {
    return null;
  }
  return parseInt(raw, 10);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, page: rawPage } = await params;
  const page = parsePage(rawPage);
  const company = await findCompanyBySlug(slug);

  if (!company || !page || page < 2) {
    return { title: '기업을 찾을 수 없습니다' };
  }

  return buildPageMetadata({
    title: `${company.name} 기술 블로그 최신 글 (${page}페이지)`,
    description: `${company.name} 기술 블로그 글 모음 ${page}페이지입니다. devBlog.kr에서 ${company.name}의 개발 이야기를 확인하세요.`,
    path: `/companies/${companySlug(company)}/page/${page}`,
  });
}

export default async function CompanyPagedPage({ params }: PageProps) {
  const { slug, page: rawPage } = await params;
  const page = parsePage(rawPage);

  if (!page || page < 1) {
    notFound();
  }

  // 1페이지는 canonical URL로 통일
  if (page === 1) {
    permanentRedirect(`/companies/${slug}`);
  }

  return <CompanyLanding slug={slug} page={page} />;
}
