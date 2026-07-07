import type { Metadata } from 'next';
import Link from 'next/link';
import { APP, buildPageMetadata, slugify } from '@/utils';
import { fetchAllTags } from '@/features/posts';

export const revalidate = 3600; // 1시간

export const metadata: Metadata = buildPageMetadata({
  title: '태그별 기술 블로그 글 모음',
  description: 'Frontend, Backend, DevOps, AI/ML 등 태그별로 기업 기술블로그 글을 모아보세요.',
  path: '/tags',
});

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: APP.URL },
    { '@type': 'ListItem', position: 2, name: '태그', item: `${APP.URL}/tags` },
  ],
};

export default async function TagsPage() {
  const tags = await fetchAllTags();

  // 카테고리별 그룹화 (카테고리 없는 태그는 '기타')
  const grouped = new Map<string, typeof tags>();
  for (const tag of tags) {
    const category = tag.category || '기타';
    const list = grouped.get(category) || [];
    list.push(tag);
    grouped.set(category, list);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <header className="mb-8">
        <h1 className="text-2xl font-bold text-foreground md:text-4xl">태그별 모아보기</h1>
        <p className="mt-2 text-muted-foreground">관심 있는 기술 주제의 글만 골라 읽어보세요.</p>
      </header>

      {/* data-nosnippet: 검색 스니펫에 태그 목록이 발췌되지 않도록 제외 → meta description이 노출됨 */}
      <div data-nosnippet="" className="flex flex-col gap-8">
        {Array.from(grouped.entries()).map(([category, categoryTags]) => (
          <section key={category} aria-label={`${category} 태그 목록`}>
            <h2 className="mb-3 text-lg font-semibold text-foreground">{category}</h2>
            <ul className="flex flex-wrap gap-2">
              {categoryTags.map((tag) => (
                <li key={tag.id}>
                  <Link
                    href={`/tags/${slugify(tag.name)}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                  >
                    {tag.name}
                    <span className="text-xs text-muted-foreground">{tag.usage_count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
