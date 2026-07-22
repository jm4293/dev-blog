import { slugify, type WeekRange } from '@/utils';
import { createSupabaseStaticClient } from '@/supabase/static.supabase';
import type { Company, Post, PostWithCompany } from '@/supabase/types.supabase';

// posts + company 조인 쿼리의 행 타입 (수동 타입 환경)
type PostRow = Post & { company: Company | null };

export interface DigestStat {
  name: string;
  count: number;
  /** 회사 통계에만 존재 — /companies/[slug] 내부 링크용 */
  slug?: string;
}

export interface WeeklyDigest {
  /** 인기순 상위 글 (북마크 3점 + 조회 1점) */
  topPosts: PostWithCompany[];
  /** 해당 주에 수집된 전체 글 수 */
  totalCount: number;
  /** 회사별 글 수 (상위 5개) */
  companyStats: DigestStat[];
  /** 태그별 글 수 (상위 8개) */
  tagStats: DigestStat[];
}

const TOP_POSTS_COUNT = 10;
const MAX_WEEK_POSTS = 500;

function engagementScore(post: Post): number {
  return post.bookmark_count * 3 + post.view_count;
}

function topStats(counts: Map<string, number>, limit: number): DigestStat[] {
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * 특정 주에 발행된 글의 인기 순위와 통계를 집계한다.
 * 공개 데이터만 다루므로 정적 클라이언트 사용 (빌드 타임/ISR 렌더링 가능).
 */
export async function fetchWeeklyDigest(range: WeekRange): Promise<WeeklyDigest> {
  const supabase = createSupabaseStaticClient();

  const { data, error } = await supabase
    .from('posts')
    .select(
      `
      id,
      company_id,
      title,
      url,
      summary,
      author,
      tags,
      published_at,
      scraped_at,
      view_count,
      bookmark_count,
      created_at,
      updated_at,
      company:companies(id, name, name_en, logo_url)
    `,
    )
    .gte('published_at', range.start.toISOString())
    .lte('published_at', range.end.toISOString())
    .order('published_at', { ascending: false })
    .limit(MAX_WEEK_POSTS);

  if (error) {
    throw error;
  }

  const posts: PostWithCompany[] = ((data || []) as unknown as PostRow[]).map((post) => ({
    ...post,
    company: post.company || ({} as Company),
  }));

  const companyCounts = new Map<string, { count: number; slug: string }>();
  const tagCounts = new Map<string, number>();

  for (const post of posts) {
    if (post.company.name) {
      const entry = companyCounts.get(post.company.name);
      if (entry) {
        entry.count += 1;
      } else {
        companyCounts.set(post.company.name, {
          count: 1,
          slug: slugify(post.company.name_en || post.company.name),
        });
      }
    }
    for (const tag of post.tags || []) {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    }
  }

  const topPosts = [...posts]
    .sort((a, b) => engagementScore(b) - engagementScore(a) || +new Date(b.published_at) - +new Date(a.published_at))
    .slice(0, TOP_POSTS_COUNT);

  const companyStats: DigestStat[] = Array.from(companyCounts.entries())
    .map(([name, { count, slug }]) => ({ name, count, slug }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    topPosts,
    totalCount: posts.length,
    companyStats,
    tagStats: topStats(tagCounts, 8),
  };
}
