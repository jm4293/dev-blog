import { createSupabaseServerClient } from '@/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();

    // 사용자 인증 확인
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // URL에서 year 파라미터 가져오기
    const { searchParams } = new URL(request.url);
    const yearParam = searchParams.get('year');
    const year = yearParam ? parseInt(yearParam, 10) : new Date().getFullYear();

    // 해당 년도의 1월 1일 ~ 12월 31일
    const startDate = new Date(year, 0, 1); // 1월 1일
    const endDate = new Date(year, 11, 31, 23, 59, 59); // 12월 31일

    const { data: bookmarks, error } = await supabase
      .from('bookmarks')
      .select('created_at')
      .eq('user_id', user.id)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: true });

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch bookmark stats' }, { status: 500 });
    }

    // 날짜별 즐겨찾기 횟수 집계
    const stats: Record<string, number> = {};

    bookmarks?.forEach((bookmark) => {
      const date = new Date(bookmark.created_at).toISOString().split('T')[0]; // YYYY-MM-DD
      stats[date] = (stats[date] || 0) + 1;
    });

    return NextResponse.json({
      stats,
      total: bookmarks?.length || 0,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
