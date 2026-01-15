import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/supabase';
import { ANNOUNCEMENTS } from '@/utils/constants';
import type { Announcement, AnnouncementsResponse } from '@/supabase';

/**
 * GET /api/announcements
 * 공지사항 조회 (페이지네이션 지원)
 *
 * 쿼리 파라미터:
 * - page: 페이지 번호 (기본값: 1)
 * - limit: 페이지당 항목 수 (기본값: 20)
 *
 * 응답:
 * - announcements: 공지사항 배열 (상단 고정 먼저, 최신순)
 * - total: 전체 공지사항 수
 * - page: 현재 페이지
 * - page_size: 페이지당 항목 수
 * - total_pages: 전체 페이지 수
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = parseInt(searchParams.get('limit') || String(ANNOUNCEMENTS.ITEMS_PER_PAGE), 10);

    const supabase = await createSupabaseServerClient();

    // 1. 전체 공지사항 수 조회
    const { count, error: countError } = await supabase
      .from('announcements')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      return NextResponse.json({ error: 'Failed to fetch announcements count' }, { status: 500 });
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;

    // 2. 공지사항 조회 (상단 고정 먼저, 최신순)
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('is_pinned', { ascending: false }) // 상단 고정 먼저
      .order('created_at', { ascending: false }) // 그 다음 최신순
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch announcements' }, { status: 500 });
    }

    // 3. 응답 생성
    const response: AnnouncementsResponse = {
      announcements: (data || []) as Announcement[],
      total,
      page,
      page_size: limit,
      total_pages: totalPages,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
