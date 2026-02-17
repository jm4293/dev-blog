export { createSupabaseClient } from './client.supabase';
// Note: server.supabase는 서버 전용 코드입니다. 직접 import 사용 권장:
// import { createSupabaseServerClient, createSupabaseAdminClient } from '@/supabase/server.supabase'
export type {
  Company,
  Post,
  PostWithCompany,
  Bookmark,
  BookmarkWithPost,
  RecentView,
  RecentViewWithPost,
  RecentViewsResponse,
  Tag,
  Request,
  AnnouncementType,
  Announcement,
  AnnouncementsResponse,
} from './types.supabase';
