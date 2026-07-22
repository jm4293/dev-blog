import { createSupabaseStaticClient } from '@/supabase/static.supabase';
import type { Company, Post, PostWithCompany } from '@/supabase/types.supabase';

// posts + company 조인 쿼리의 행 타입 (fetch-posts.ts와 동일한 수동 타입 패턴)
type PostRow = Post & { company: Company | null };

interface FetchTrendingParams {
  /** 조회 기간 (일). 기본 7일, 결과가 없으면 30일로 확장 */
  days?: number;
  limit?: number;
}

/**
 * 최근 N일 내 인기 글 조회 (북마크 수 → 조회수 → 최신순)
 */
export async function fetchTrendingPosts({ days = 7, limit = 3 }: FetchTrendingParams = {}): Promise<
  PostWithCompany[]
> {
  // 공개 데이터만 조회하므로 정적 클라이언트 사용 (정적 페이지에서 호출 가능)
  const supabase = createSupabaseStaticClient();

  const queryTrending = async (sinceDays: number) => {
    const since = new Date(Date.now() - sinceDays * 24 * 60 * 60 * 1000).toISOString();

    return (
      supabase
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
        .gte('published_at', since)
        // 실제 반응(북마크/조회)이 있는 글만 — 없으면 최신 목록과 중복되므로 섹션을 숨긴다
        .or('bookmark_count.gt.0,view_count.gt.0')
        .order('bookmark_count', { ascending: false })
        .order('view_count', { ascending: false })
        .order('published_at', { ascending: false })
        .limit(limit)
    );
  };

  let { data, error } = await queryTrending(days);

  if (error) {
    throw error;
  }

  // 최근 7일에 반응 있는 글이 없는 경우 기간 확장 (30일)
  if (!data || data.length === 0) {
    const fallback = await queryTrending(30);
    if (fallback.error) {
      throw fallback.error;
    }
    data = fallback.data;
  }

  return ((data || []) as unknown as PostRow[]).map((post) => ({
    ...post,
    company: post.company || ({} as Company),
  }));
}
