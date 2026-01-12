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
import { getSupabaseServerClient } from '@/supabase/server.supabase';
import { Tag } from '@/supabase/types.supabase';

interface TagsResponse {
  tags: Tag[];
  total: number;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseServerClient();

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

    return NextResponse.json(response);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('Tags API error:', errorMsg);

    return NextResponse.json({ error: 'Failed to fetch tags', details: errorMsg }, { status: 500 });
  }
}
