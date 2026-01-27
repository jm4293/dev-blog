/**
 * GET /api/posts
 * 게시글 목록 조회 (검색, 필터링, 페이지네이션)
 *
 * Query Parameters:
 * - page: 페이지 번호 (기본값: 1)
 * - search: 검색어 (제목 기반)
 * - tags: 태그 필터 (쉼표로 구분, OR 조건)
 * - company: 블로그 ID 필터 (단일)
 * - companies: 블로그 ID 필터 (쉼표로 구분, 다중, OR 조건)
 * - sort: 정렬 방식 (newest, oldest, 기본값: newest)
 * - limit: 페이지당 게시글 수 (기본값: 20)
 * *
 */

import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, extractIP, createRateLimitResponse, RATE_LIMIT_CONFIG } from '@/utils';
import { createSupabaseServerClient, PostWithCompany } from '@/supabase';

interface PostsResponse {
  posts: PostWithCompany[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export async function GET(request: NextRequest) {
  try {
    // Rate Limiting (공개 API)
    const ip = extractIP(request);
    const isAllowed = checkRateLimit(ip, RATE_LIMIT_CONFIG.PUBLIC);

    if (!isAllowed) {
      return createRateLimitResponse('Too many requests. Rate limit: 100 requests per hour');
    }

    const supabase = await createSupabaseServerClient();

    // Query 파라미터 파싱
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const search = searchParams.get('search') || '';
    const tagsParam = searchParams.get('tags') || '';
    const companyId = searchParams.get('company') || '';
    const companiesParam = searchParams.get('companies') || '';
    const sortParam = searchParams.get('sort') || 'newest';
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '20', 10));

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
    const isAscending = sortParam === 'oldest';
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

    // 블로그 필터 promise 즉시 시작 (waterfall 방지)
    let companiesPromise: any = null;
    if (companies.length > 0 && !companyId) {
      companiesPromise = supabase.from('companies').select('id').in('name', companies);
    }

    // 태그 필터 (OR 조건: 하나 이상의 태그 포함)
    if (tags.length > 0) {
      // tags 배열에 하나라도 포함되어야 함 (OR 조건)
      countQuery = countQuery.overlaps('tags', tags);
      postsQuery = postsQuery.overlaps('tags', tags);
    }

    // 블로그 필터 (단일 또는 다중)
    if (companyId) {
      // 단일 블로그 필터
      countQuery = countQuery.eq('company_id', companyId);
      postsQuery = postsQuery.eq('company_id', companyId);
    } else if (companies.length > 0) {
      // 다중 블로그 필터 (OR 조건: company name으로 필터링)
      // companies 배열에는 company name이 들어옴
      // promise 결과 대기
      if (companiesPromise) {
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
    const response: PostsResponse = {
      posts: typedPosts,
      total,
      page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };

    return NextResponse.json(response);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    const isDev = process.env.NODE_ENV === 'development';

    // 프로덕션 환경에서는 상세 정보 숨김
    return NextResponse.json(
      {
        error: 'Failed to fetch posts',
        ...(isDev && { details: errorMsg }),
      },
      { status: 500 },
    );
  }
}
