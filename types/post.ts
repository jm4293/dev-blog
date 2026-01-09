export interface Post {
  id: string
  company_id: string
  title: string
  url: string
  content?: string
  summary?: string
  author?: string
  tags: string[]
  published_at: string
  scraped_at: string
  created_at: string
  updated_at: string
}

export interface Company {
  id: string
  name: string
  name_en?: string
  logo_url?: string
  blog_url: string
  rss_url: string
  description?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface PostWithCompany extends Post {
  company: Company
}
