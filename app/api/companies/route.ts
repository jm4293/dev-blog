import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/supabase/server.supabase';
import { Company } from '@/supabase/types.supabase';
import { checkRateLimit, extractIP, createRateLimitResponse, RATE_LIMIT_CONFIG } from '@/utils/rate-limit';

interface CompaniesResponse {
  companies: Company[];
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

    let query = supabase.from('companies').select('*');

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
      companies: (companies as Company[]) || [],
      total: companies?.length || 0,
    };

    return NextResponse.json(response);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);

    return NextResponse.json({ error: 'Failed to fetch companies', details: errorMsg }, { status: 500 });
  }
}
