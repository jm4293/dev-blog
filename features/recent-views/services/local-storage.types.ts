import { PostWithCompany } from '@/supabase';

export interface RecentView {
  postId: string;
  viewedAt: string;
  post: PostWithCompany;
}
