import { PostWithCompany } from '@/supabase/types.supabase';

export interface RecentView {
  postId: string;
  viewedAt: string;
  post: PostWithCompany;
}
