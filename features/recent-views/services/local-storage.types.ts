import { PostWithCompany } from '@/supabase/types.supabase';

/** 최근 본 글 localStorage 키 (여러 훅이 공유하므로 여기서만 정의) */
export const RECENT_VIEWS_STORAGE_KEY = 'recent-posts';

/** localStorage에 보관하는 최대 기록 수 */
export const MAX_LOCAL_RECENT_VIEWS = 20;

export interface RecentView {
  postId: string;
  viewedAt: string;
  post: PostWithCompany;
}
