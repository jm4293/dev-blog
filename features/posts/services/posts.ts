/**
 * Posts 서비스
 * 게시글 관련 비즈니스 로직
 */

import { getSupabaseServerClient } from '@/shared/lib/supabase/server'
import { PostWithCompany, Post } from '@/shared/lib/supabase/types'

export interface FetchPostsOptions {
  page?: number
  limit?: number
  search?: string
  tags?: string[]
  companyId?: string
}

export interface PostsResult {
  posts: PostWithCompany[]
  total: number
  page: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

/**
 * 게시글 목록 조회
 */
export async function fetchPosts(
  options: FetchPostsOptions = {}
): Promise<PostsResult> {
  const supabase = getSupabaseServerClient()

  const {
    page = 1,
    limit = 20,
    search = '',
    tags = [],
    companyId = '',
  } = options

  const offset = (page - 1) * limit

  // 기본 쿼리
  let countQuery = supabase
    .from('posts')
    .select('id', { count: 'exact', head: true })

  let postsQuery = supabase
    .from('posts')
    .select(
      `
      id,
      company_id,
      title,
      url,
      content,
      summary,
      author,
      tags,
      published_at,
      scraped_at,
      created_at,
      updated_at,
      company:companies(*)
    `
    )
    .order('published_at', { ascending: false })

  // 검색 필터
  if (search) {
    const searchTerm = `%${search}%`
    countQuery = countQuery.ilike('title', searchTerm)
    postsQuery = postsQuery.ilike('title', searchTerm)
  }

  // 태그 필터 (모든 태그 포함)
  if (tags.length > 0) {
    countQuery = countQuery.contains('tags', tags)
    postsQuery = postsQuery.contains('tags', tags)
  }

  // 기업 필터
  if (companyId) {
    countQuery = countQuery.eq('company_id', companyId)
    postsQuery = postsQuery.eq('company_id', companyId)
  }

  // 카운트 조회
  const { count } = await countQuery
  const total = count || 0
  const totalPages = Math.ceil(total / limit)

  // 페이지네이션 적용
  const { data: posts } = await postsQuery.range(offset, offset + limit - 1)

  return {
    posts: (posts as PostWithCompany[]) || [],
    total,
    page,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  }
}

/**
 * 특정 게시글 조회
 */
export async function getPost(postId: string): Promise<PostWithCompany | null> {
  const supabase = getSupabaseServerClient()

  const { data: post } = await supabase
    .from('posts')
    .select(
      `
      id,
      company_id,
      title,
      url,
      content,
      summary,
      author,
      tags,
      published_at,
      scraped_at,
      created_at,
      updated_at,
      company:companies(*)
    `
    )
    .eq('id', postId)
    .single()

  return post as PostWithCompany | null
}

/**
 * 게시글 저장 (중복 체크 포함)
 */
export async function savePost(post: Omit<Post, 'id' | 'created_at' | 'updated_at'>): Promise<Post | null> {
  const supabase = getSupabaseServerClient()

  // 중복 체크
  const { data: existing } = await supabase
    .from('posts')
    .select('id')
    .eq('url', post.url)
    .single()

  if (existing) {
    return null // 이미 존재함
  }

  const { data: newPost, error } = await (supabase.from('posts') as any)
    .insert([post])
    .select()
    .single()

  if (error) throw error
  return newPost as Post
}

/**
 * 게시글 벌크 저장
 */
export async function savePosts(
  posts: Omit<Post, 'id' | 'created_at' | 'updated_at'>[]
): Promise<{
  created: Post[]
  duplicates: string[]
  errors: Array<{ url: string; error: string }>
}> {
  const created: Post[] = []
  const duplicates: string[] = []
  const errors: Array<{ url: string; error: string }> = []

  for (const post of posts) {
    try {
      const result = await savePost(post)
      if (result) {
        created.push(result)
      } else {
        duplicates.push(post.url)
      }
    } catch (err) {
      errors.push({
        url: post.url,
        error: err instanceof Error ? err.message : 'Unknown error',
      })
    }
  }

  return { created, duplicates, errors }
}
