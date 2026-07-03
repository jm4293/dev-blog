import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { buildPageMetadata, slugify } from '@/utils';
import { findTagBySlug, TagLanding } from '@/features/posts';

interface PageProps {
  params: Promise<{ slug: string; page: string }>;
}

export const revalidate = 3600; // 1시간 (첫 요청 시 생성 후 ISR 캐시)

// 페이지 번호는 요청 시점에 생성 (태그 수 × 페이지 수를 빌드 타임에 모두 만들 필요 없음)
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
  const tag = await findTagBySlug(slug);

  if (!tag || !page || page < 2) {
    return { title: '태그를 찾을 수 없습니다' };
  }

  return buildPageMetadata({
    title: `${tag.name} 기술 블로그 글 모음 (${page}페이지)`,
    description: `기업 기술블로그의 ${tag.name} 관련 글 모음 ${page}페이지입니다.`,
    path: `/tags/${slugify(tag.name)}/page/${page}`,
  });
}

export default async function TagPagedPage({ params }: PageProps) {
  const { slug, page: rawPage } = await params;
  const page = parsePage(rawPage);

  if (!page || page < 1) {
    notFound();
  }

  // 1페이지는 canonical URL로 통일
  if (page === 1) {
    permanentRedirect(`/tags/${slug}`);
  }

  return <TagLanding slug={slug} page={page} />;
}
