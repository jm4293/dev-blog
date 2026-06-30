import { NextResponse } from 'next/server';
import { checkRateLimit, createRateLimitResponse, extractIP, RATE_LIMIT_CONFIG } from '@/utils';
import { createSupabaseServerClient } from '@/supabase/server.supabase';
import { Company } from '@/supabase/types.supabase';

// 클라이언트(블로그 필터)는 id/name/logo_url 만 사용하므로 해당 컬럼만 직렬화
type BlogListItem = Pick<Company, 'id' | 'name' | 'logo_url'>;

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

    const supabase = await createSupabaseServerClient();
    const { searchParams } = new URL(request.url);

    const featured = searchParams.get('featured') === 'true';
    const all = searchParams.get('all') === 'true';

    let query = supabase.from('companies').select('id, name, logo_url');

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

    return NextResponse.json(response);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);

    return NextResponse.json({ error: 'Failed to fetch companies', details: errorMsg }, { status: 500 });
  }
}
