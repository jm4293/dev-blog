import type { PostWithCompany } from '@/supabase';

export interface GetPostsParams {
  page?: number;
  search?: string;
  tags?: string[];
  blogs?: string[];
  companyId?: string;
  sort?: 'newest' | 'oldest';
  limit?: number;
}

export interface GetPostsResponse {
  posts: PostWithCompany[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
