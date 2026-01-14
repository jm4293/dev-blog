export interface Company {
  id: string;
  name: string;
  name_en?: string;
  logo_url?: string;
  blog_url: string;
  rss_url: string;
  description?: string;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  company_id: string;
  title: string;
  url: string;
  content?: string;
  summary?: string;
  author?: string;
  tags: string[];
  published_at: string;
  scraped_at: string;
  created_at: string;
  updated_at: string;
}

export interface PostWithCompany extends Post {
  company: Company;
}

export interface Bookmark {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
}

export interface BookmarkWithPost extends Bookmark {
  post: PostWithCompany;
}

export interface Tag {
  id: string;
  name: string;
  category?: string;
  usage_count: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Request {
  id: string;
  type: 'company' | 'tag' | 'other';
  company_name?: string;
  tag_name?: string;
  blog_url?: string;
  message: string;
  email?: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}
