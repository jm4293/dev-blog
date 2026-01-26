import { createSupabaseServerClient } from '@/supabase';
import { ANNOUNCEMENTS } from '@/utils/constants';
import type { Announcement, AnnouncementsResponse } from '@/supabase';

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

  // 1. 전체 공지사항 수 조회
  const { count, error: countError } = await supabase.from('announcements').select('*', { count: 'exact', head: true });

  if (countError) {
    throw new Error('Failed to fetch announcements count');
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
    throw new Error('Failed to fetch announcements');
  }

  return {
    announcements: (data || []) as Announcement[],
    total,
    page,
    page_size: limit,
    total_pages: totalPages,
  };
}
