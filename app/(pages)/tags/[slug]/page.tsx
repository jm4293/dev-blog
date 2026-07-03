import type { Metadata } from 'next';
import { buildPageMetadata, slugify } from '@/utils';
import { fetchAllTags, findTagBySlug, TagLanding } from '@/features/posts';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600; // 1시간

export async function generateStaticParams() {
  const tags = await fetchAllTags();
  return tags.map((tag) => ({ slug: slugify(tag.name) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = await findTagBySlug(slug);

  if (!tag) {
    return { title: '태그를 찾을 수 없습니다' };
  }

  return buildPageMetadata({
    title: `${tag.name} 기술 블로그 글 모음`,
    description: `기업 기술블로그의 ${tag.name} 관련 글 ${tag.usage_count}개를 모았습니다.`,
    path: `/tags/${slugify(tag.name)}`,
  });
}

export default async function TagPage({ params }: PageProps) {
  const { slug } = await params;

  return <TagLanding slug={slug} page={1} />;
}
