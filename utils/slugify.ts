/**
 * 태그/회사 이름을 URL 슬러그로 변환
 * 예: 'AI/ML' → 'ai-ml', 'Next.js' → 'next-js', '우아한형제들' → '우아한형제들' (한글 유지, 인코딩은 Next가 처리)
 *
 * 역변환은 불가능하므로, 슬러그 → 원본 매칭은 전체 목록을 조회해 slugify 결과를 비교한다.
 */
export function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[/.\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/** 슬러그와 일치하는 항목을 목록에서 찾는다 */
export function findBySlug<T>(items: T[], slug: string, getName: (item: T) => string): T | undefined {
  const decoded = decodeURIComponent(slug);
  return items.find((item) => slugify(getName(item)) === decoded);
}
