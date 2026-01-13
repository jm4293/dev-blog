/**
 * GET /api/companies
 * 기업 목록 조회
 *
 * Query Parameters:
 *   - featured: "true" - 인기 기업만 조회 (is_featured=true)
 *   - all: "true" - 비활성화된 기업 포함 (기본값: 활성화만)
 *
 * 예시:
 *   - /api/companies - 활성화된 모든 기업
 *   - /api/companies?featured=true - 인기 기업만
 *   - /api/companies?all=true - 모든 기업 (활성화/비활성화)
 */

import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/supabase/server.supabase';
import { Company } from '@/supabase/types.supabase';

interface CompaniesResponse {
  companies: Company[];
  total: number;
}

export async function GET(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { searchParams } = new URL(request.url);

    const featured = searchParams.get('featured') === 'true';
    const all = searchParams.get('all') === 'true';

    let query = supabase.from('companies').select('*');

    // 필터링: featured 또는 활성화된 기업
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
    console.error('Companies API error:', errorMsg);

    return NextResponse.json({ error: 'Failed to fetch companies', details: errorMsg }, { status: 500 });
  }
}
