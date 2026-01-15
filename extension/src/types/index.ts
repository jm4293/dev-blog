/**
 * 확장플러그인 타입 정의
 */

export interface Company {
  id: string;
  name: string;
  name_en?: string;
  logo_url?: string;
  blog_url?: string;
  rss_url?: string;
  description?: string;
  is_active?: boolean;
  is_featured?: boolean;
}

export interface Post {
  id: string;
  company_id: string;
  company?: Company;
  title: string;
  url: string;
  content?: string;
  summary?: string;
  author?: string;
  tags?: string[] | null;
  published_at?: string;
  scraped_at?: string;
  created_at?: string;
}

export interface Tag {
  id: string;
  name: string;
  category?: string;
  usage_count: number;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface FetchPostsResponse {
  data: Post[];
  pagination: Pagination;
}

export interface FetchPostsParams {
  page?: number;
  limit?: number;
  search?: string;
  tags?: string[];
  companies?: string[];
  sort?: 'latest' | 'oldest' | 'company' | 'tag';
}
