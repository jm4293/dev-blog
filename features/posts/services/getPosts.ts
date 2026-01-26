import { createSupabaseServerClient, PostWithCompany } from '@/supabase';
import type { GetPostsParams, GetPostsResponse } from '../types';

/**
 * 서버에서 게시글 목록을 조회합니다.
 * SSR을 위해 page.tsx에서 직접 호출합니다.
 */
export async function getPosts({
  page = 1,
  search = '',
  tags: tagsParam = '',
  companies: companiesParam = '',
  companyId = '',
  sort = 'newest',
  limit = 20,
}: GetPostsParams = {}): Promise<GetPostsResponse> {
  const supabase = await createSupabaseServerClient();

  const offset = (page - 1) * limit;
  const tags = tagsParam
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
  const companies = companiesParam
    .split(',')
    .map((c) => c.trim())
    .filter((c) => c.length > 0);

  // 1. 전체 게시글 수 조회
  let countQuery = supabase.from('posts').select('id', { count: 'exact', head: true });

  // 2. 게시글 목록 조회 (정렬: 기본값은 최신순)
  const isAscending = sort === 'oldest';
  let postsQuery = supabase
    .from('posts')
    .select(
      `
      id,
      company_id,
      title,
      url,
      content,
      summary,
      author,
      tags,
      published_at,
      scraped_at,
      created_at,
      updated_at,
      company:companies(*)
    `,
    )
    .order('published_at', { ascending: isAscending });

  // 검색 필터 (제목 기반)
  if (search) {
    const searchTerm = `%${search}%`;
    countQuery = countQuery.ilike('title', searchTerm);
    postsQuery = postsQuery.ilike('title', searchTerm);
  }

  // 기업 필터 promise 즉시 시작 (waterfall 방지)
  let companiesPromise: any = null;
  if (companies.length > 0 && !companyId) {
    companiesPromise = supabase.from('companies').select('id').in('name', companies);
  }

  // 태그 필터 (OR 조건: 하나 이상의 태그 포함)
  if (tags.length > 0) {
    countQuery = countQuery.overlaps('tags', tags);
    postsQuery = postsQuery.overlaps('tags', tags);
  }

  // 기업 필터 (단일 또는 다중)
  if (companyId) {
    countQuery = countQuery.eq('company_id', companyId);
    postsQuery = postsQuery.eq('company_id', companyId);
  } else if (companies.length > 0 && companiesPromise) {
    const { data: companiesData, error: companiesError } = await companiesPromise;

    if (companiesError) {
      throw companiesError;
    }

    const companyIds = companiesData?.map((c: { id: string }) => c.id) || [];
    if (companyIds.length > 0) {
      countQuery = countQuery.in('company_id', companyIds);
      postsQuery = postsQuery.in('company_id', companyIds);
    }
  }

  // 전체 개수 조회
  const { count, error: countError } = await countQuery;

  if (countError) {
    throw countError;
  }

  const total = count || 0;
  const totalPages = Math.ceil(total / limit);

  // 페이지네이션 적용
  const { data: posts, error: postsError } = await postsQuery.range(offset, offset + limit - 1);

  if (postsError) {
    throw postsError;
  }

  // 응답 형식 변환
  const typedPosts: PostWithCompany[] = (posts || []).map((post: any) => ({
    ...post,
    company: post.company || ({} as any),
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
