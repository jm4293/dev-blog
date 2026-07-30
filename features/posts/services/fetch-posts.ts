import { createSupabaseServerClient } from '@/supabase/server.supabase';
import { createSupabaseStaticClient } from '@/supabase/static.supabase';
import type { Company, Post, PostWithCompany } from '@/supabase/types.supabase';
import { PAGINATION } from '@/utils/constants';
import type { PostSortOption } from '@/utils/parse-search-params';

// posts + company 조인 쿼리의 행 타입 (수동 타입 환경이라 명시적으로 선언)
type PostRow = Post & { company: Company | null };

// 블로그명 → company_id 조회 쿼리의 결과 타입
type BlogIdsResult = { data: { id: string }[] | null; error: { message: string } | null };

interface GetPostsParams {
  page?: number;
  search?: string;
  tags?: string[];
  blogs?: string[];
  companyId?: string;
  sort?: PostSortOption;
  limit?: number;
  /**
   * 쿠키 없는 정적 클라이언트 사용 (ISR/정적 페이지용)
   * cookies()를 읽는 서버 클라이언트는 라우트를 동적 렌더링으로 만들기 때문에,
   * 공개 데이터만 필요한 랜딩 페이지는 이 옵션을 켜야 정적 생성이 가능하다.
   */
  useStaticClient?: boolean;
}

export interface GetPostsResponse {
  posts: PostWithCompany[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * 검색어 → PostgREST or() 필터 문자열 (제목 + 요약 ilike)
 *
 * - 길이 100자 제한 (비정상 입력으로 인한 풀스캔 방지)
 * - LIKE 와일드카드(%, _)와 역슬래시 이스케이프 (패턴 인젝션 방지)
 * - or() 구문 예약문자(쉼표 등)가 섞여도 안전하도록 값을 쌍따옴표로 감싼다
 */
function buildSearchFilter(search: string): string {
  const escaped = search.slice(0, 100).replace(/[\\%_]/g, '\\$&');
  const pattern = `%${escaped}%`;
  const quoted = `"${pattern.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  return `title.ilike.${quoted},summary.ilike.${quoted}`;
}

export async function fetchPosts({
  page = 1,
  search = '',
  tags = [],
  blogs = [],
  companyId = '',
  sort = 'newest',
  limit = PAGINATION.ITEMS_PER_PAGE,
  useStaticClient = false,
}: GetPostsParams = {}): Promise<GetPostsResponse> {
  const supabase = useStaticClient ? createSupabaseStaticClient() : await createSupabaseServerClient();

  const offset = (page - 1) * limit;

  // 1. 전체 게시글 수 조회
  let countQuery = supabase.from('posts').select('id', { count: 'exact', head: true });

  // 2. 게시글 목록 조회 (정렬: 기본값은 최신순)
  let postsQuery = supabase.from('posts').select(
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
  );

  if (sort === 'popular') {
    // 인기순: 북마크(강한 신호) → 조회수 → 최신 순으로 폴백
    postsQuery = postsQuery
      .order('bookmark_count', { ascending: false })
      .order('view_count', { ascending: false })
      .order('published_at', { ascending: false });
  } else {
    postsQuery = postsQuery.order('published_at', { ascending: sort === 'oldest' });
  }

  // 검색 필터 (제목 + 요약)
  if (search) {
    const searchFilter = buildSearchFilter(search);
    countQuery = countQuery.or(searchFilter);
    postsQuery = postsQuery.or(searchFilter);
  }

  // 블로그 필터 promise 즉시 시작 (waterfall 방지)
  let blogsPromise: PromiseLike<BlogIdsResult> | null = null;
  if (blogs.length > 0 && !companyId) {
    blogsPromise = supabase.from('companies').select('id').in('name', blogs);
  }

  // 태그 필터 (OR 조건: 하나 이상의 태그 포함)
  if (tags.length > 0) {
    countQuery = countQuery.overlaps('tags', tags);
    postsQuery = postsQuery.overlaps('tags', tags);
  }

  // 블로그 필터 (단일 또는 다중)
  if (companyId) {
    countQuery = countQuery.eq('company_id', companyId);
    postsQuery = postsQuery.eq('company_id', companyId);
  } else if (blogs.length > 0 && blogsPromise) {
    const { data: blogsData, error: blogsError } = await blogsPromise;

    if (blogsError) {
      throw blogsError;
    }

    const companyIds = blogsData?.map((c) => c.id) || [];
    if (companyIds.length > 0) {
      countQuery = countQuery.in('company_id', companyIds);
      postsQuery = postsQuery.in('company_id', companyIds);
    }
  }

  // 전체 개수 조회 + 게시글 목록 조회 (병렬 실행)
  const [countResult, postsResult] = await Promise.all([countQuery, postsQuery.range(offset, offset + limit - 1)]);

  if (countResult.error) {
    throw countResult.error;
  }

  if (postsResult.error) {
    throw postsResult.error;
  }

  const total = countResult.count || 0;
  const totalPages = Math.ceil(total / limit);
  const posts = postsResult.data;

  // 응답 형식 변환
  // (생성 타입은 조인을 배열로 추론하지만 to-one 관계라 런타임은 단일 객체이므로 unknown 경유 캐스트)
  const typedPosts: PostWithCompany[] = ((posts || []) as unknown as PostRow[]).map((post) => ({
    ...post,
    company: post.company || ({} as Company),
  }));

  return {
    posts: typedPosts,
    total,
    page,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}
