import { createSupabaseServerClient } from '@/supabase/server.supabase';
import type { Announcement, AnnouncementsResponse } from '@/supabase/types.supabase';
import { ANNOUNCEMENTS } from '@/utils/constants';

interface FetchAnnouncementsOptions {
  page?: number;
  limit?: number;
}

/**
 * 서버 측 공지사항 조회
 */
export async function fetchAnnouncements({
  page = 1,
  limit = ANNOUNCEMENTS.ITEMS_PER_PAGE,
}: FetchAnnouncementsOptions = {}): Promise<AnnouncementsResponse> {
  const supabase = await createSupabaseServerClient();

  const offset = (page - 1) * limit;

  // 전체 수 + 목록 병렬 조회 (서로 독립인 쿼리)
  const [{ count, error: countError }, { data, error }] = await Promise.all([
    supabase.from('announcements').select('*', { count: 'exact', head: true }),
    supabase
      .from('announcements')
      .select('*')
      .order('is_pinned', { ascending: false }) // 상단 고정 먼저
      .order('created_at', { ascending: false }) // 그 다음 최신순
      .range(offset, offset + limit - 1),
  ]);

  if (countError) {
    throw new Error('Failed to fetch announcements count');
  }

  if (error) {
    throw new Error('Failed to fetch announcements');
  }

  const total = count || 0;
  const totalPages = Math.ceil(total / limit);

  return {
    announcements: (data || []) as Announcement[],
    total,
    page,
    page_size: limit,
    total_pages: totalPages,
  };
}
