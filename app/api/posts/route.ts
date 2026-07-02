/**
 * Posts API
 *
 * GET /api/posts — 게시글 목록 조회 (검색/태그/블로그 필터, 페이지네이션)
 *
 * /posts 페이지가 정적 생성되면서, 필터가 적용된 조회는
 * 클라이언트(TanStack Query)가 이 엔드포인트를 호출한다.
 */
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, createRateLimitResponse, extractIP, parsePostsSearchParams, RATE_LIMIT_CONFIG } from '@/utils';
import { fetchPosts } from '@/features/posts';

export async function GET(request: NextRequest) {
  try {
    // Rate Limiting
    const ip = extractIP(request);
    if (!checkRateLimit(ip, RATE_LIMIT_CONFIG.PUBLIC)) {
      return createRateLimitResponse('Too many requests. Rate limit: 100 requests per hour');
    }

    const { page, search, tags, blogs, sort } = parsePostsSearchParams(
      Object.fromEntries(request.nextUrl.searchParams.entries()),
    );

    const data = await fetchPosts({ page, search, tags, blogs, sort });

    return NextResponse.json(data);
  } catch (error) {
    console.error(error, { method: 'GET', endpoint: '/api/posts' });
    return NextResponse.json({ error: 'Internal server error', details: 'Failed to fetch posts' }, { status: 500 });
  }
}
