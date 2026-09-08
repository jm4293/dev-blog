import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { buildPageMetadata, slugify } from '@/utils';
import { findTagBySlug, TagLanding } from '@/features/posts';

interface PageProps {
  params: Promise<{ slug: string; page: string }>;
}

// 페이지 번호 URL은 태그 수 × 페이지 수로 사실상 무한하고 크롤러가 주로 방문한다.
// ISR로 두면 URL마다(존재하지 않는 페이지 포함) 내구 캐시 쓰기가 발생해 Vercel ISR Write 한도를 소진하므로
// 요청 시 렌더링(함수 호출은 무료 한도가 훨씬 넉넉함)으로 처리한다.
export const dynamic = 'force-dynamic';

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
