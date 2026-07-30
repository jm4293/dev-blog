/**
 * GET /api/tags
 * 태그 목록 조회
 *
 * Query Parameters:
 * - featured: "true" - 인기 태그만 조회 (is_featured=true)
 * - category: 특정 카테고리의 태그만 조회
 * - sort: 정렬 방식 (name|usage|featured, 기본값: usage)
 */
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, createRateLimitResponse, extractIP, RATE_LIMIT_CONFIG } from '@/utils';
import { createSupabaseStaticClient } from '@/supabase/static.supabase';
import { Tag } from '@/supabase/types.supabase';

interface TagsResponse {
  tags: Tag[];
  total: number;
}

export async function GET(request: NextRequest) {
  try {
    // Rate Limiting (공개 API)
    const ip = extractIP(request);
    const isAllowed = checkRateLimit(ip, RATE_LIMIT_CONFIG.PUBLIC);

    if (!isAllowed) {
      return createRateLimitResponse('Too many requests. Rate limit: 100 requests per hour');
    }

    // 100% 공개 데이터 — 정적 클라이언트로 CDN 캐시 가능하게 (사전정의 태그는 거의 안 바뀜)
    const supabase = createSupabaseStaticClient();

    const searchParams = request.nextUrl.searchParams;
    const featured = searchParams.get('featured') === 'true';
    const category = searchParams.get('category') || '';
    const sort = searchParams.get('sort') || 'usage';

    let query = supabase.from('tags').select('*');

    // 인기 태그 필터
    if (featured) {
      query = query.eq('is_featured', true);
    }

    // 카테고리 필터
    if (category) {
      query = query.eq('category', category);
    }

    // 정렬
    if (sort === 'name') {
      query = query.order('name', { ascending: true });
    } else if (sort === 'featured') {
      query = query.order('is_featured', { ascending: false }).order('usage_count', { ascending: false });
    } else {
      query = query.order('usage_count', { ascending: false });
    }

    const { data: tags, error } = await query;

    if (error) {
      throw error;
    }

    const response: TagsResponse = {
      tags: (tags as Tag[]) || [],
      total: tags?.length || 0,
    };

    return NextResponse.json(response, {
      headers: {
        // 필터 모달을 열 때마다 원본(DB)까지 가지 않도록 CDN 캐시 (1시간 + SWR 하루)
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);

    return NextResponse.json({ error: 'Failed to fetch tags', details: errorMsg }, { status: 500 });
  }
}
