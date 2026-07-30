import { NextResponse } from 'next/server';
import { checkRateLimit, createRateLimitResponse, extractIP, RATE_LIMIT_CONFIG } from '@/utils';
import { createSupabaseStaticClient } from '@/supabase/static.supabase';
import { Company } from '@/supabase/types.supabase';

// 클라이언트(블로그 필터, 관심사 검색)에서 사용하는 컬럼만 직렬화
type BlogListItem = Pick<Company, 'id' | 'name' | 'name_en' | 'logo_url'>;

interface CompaniesResponse {
  companies: BlogListItem[];
  total: number;
}

export async function GET(request: Request) {
  try {
    // Rate Limiting (공개 API)
    const ip = extractIP(request);
    const isAllowed = checkRateLimit(ip, RATE_LIMIT_CONFIG.PUBLIC);

    if (!isAllowed) {
      return createRateLimitResponse('Too many requests. Rate limit: 100 requests per hour');
    }

    // 100% 공개 데이터 — 쿠키를 읽는 서버 클라이언트를 쓰면 라우트가 동적으로 고정되고
    // CDN 캐시도 불가능해지므로 정적 클라이언트 사용 (회사 목록은 하루에 몇 번 안 바뀜)
    const supabase = createSupabaseStaticClient();
    const { searchParams } = new URL(request.url);

    const featured = searchParams.get('featured') === 'true';
    const all = searchParams.get('all') === 'true';

    let query = supabase.from('companies').select('id, name, name_en, logo_url');

    // 필터링: featured 또는 활성화된 블로그
    if (featured) {
      query = query.eq('is_featured', true).eq('is_active', true);
    } else if (!all) {
      query = query.eq('is_active', true);
    }

    const { data: companies, error } = await query.order('name', { ascending: true });

    if (error) {
      throw error;
    }

    const response: CompaniesResponse = {
      companies: (companies as BlogListItem[]) || [],
      total: companies?.length || 0,
    };

    return NextResponse.json(response, {
      headers: {
        // 필터 모달을 열 때마다 원본(DB)까지 가지 않도록 CDN 캐시 (1시간 + SWR 하루)
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);

    return NextResponse.json({ error: 'Failed to fetch companies', details: errorMsg }, { status: 500 });
  }
}
