import { createSupabaseServerClient } from '@/supabase';

export interface BookmarkStats {
  stats: Record<string, number>;
  total: number;
}

/**
 * 서버 측 북마크 통계 조회
 */
export async function fetchBookmarkStats(year: number): Promise<BookmarkStats> {
  const supabase = await createSupabaseServerClient();

  // 사용자 인증 확인
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  // 비로그인 사용자는 빈 통계 반환
  if (authError || !user) {
    return {
      stats: {},
      total: 0,
    };
  }

  // 해당 년도의 1월 1일 ~ 12월 31일
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31, 23, 59, 59);

  const { data: bookmarks, error } = await supabase
    .from('bookmarks')
    .select('created_at')
    .eq('user_id', user.id)
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error('Failed to fetch bookmark stats');
  }

  // 날짜별 즐겨찾기 횟수 집계
  const stats: Record<string, number> = {};

  bookmarks?.forEach((bookmark) => {
    const date = new Date(bookmark.created_at).toISOString().split('T')[0];
    stats[date] = (stats[date] || 0) + 1;
  });

  return {
    stats,
    total: bookmarks?.length || 0,
  };
}
