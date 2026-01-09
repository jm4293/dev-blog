/**
 * Bookmarks 서비스
 * 사용자 즐겨찾기 관련 비즈니스 로직
 */

import { getSupabaseServerClient } from '@/shared/lib/supabase/server'
import { Bookmark, PostWithCompany } from '@/shared/lib/supabase/types'

export interface BookmarksResult {
  posts: PostWithCompany[]
  total: number
  page: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

/**
 * 사용자의 북마크된 게시글 조회
 */
export async function getUserBookmarks(
  userId: string,
  page: number = 1,
  limit: number = 20
): Promise<BookmarksResult> {
  const supabase = getSupabaseServerClient()

  const offset = (page - 1) * limit

  // 전체 북마크 수
  const { count } = await supabase
    .from('bookmarks')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)

  const total = count || 0
  const totalPages = Math.ceil(total / limit)

  // 북마크된 게시글 조회
  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select(
      `
      post:posts(
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
      )
    `
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  const posts = bookmarks?.map((b: any) => b.post).filter(Boolean) || []

  return {
    posts: posts as PostWithCompany[],
    total,
    page,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  }
}

/**
 * 특정 사용자의 특정 게시글 북마크 여부 확인
 */
export async function isBookmarked(
  userId: string,
  postId: string
): Promise<boolean> {
  const supabase = getSupabaseServerClient()

  const { data } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('user_id', userId)
    .eq('post_id', postId)
    .single()

  return !!data
}

/**
 * 북마크 추가
 */
export async function addBookmark(
  userId: string,
  postId: string
): Promise<Bookmark> {
  const supabase = getSupabaseServerClient()

  const { data: bookmark, error } = await supabase
    .from('bookmarks')
    .insert([{ user_id: userId, post_id: postId }] as any)
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      // 중복 북마크 에러
      throw new Error('Already bookmarked')
    }
    throw error
  }

  return bookmark as Bookmark
}

/**
 * 북마크 삭제
 */
export async function removeBookmark(
  userId: string,
  postId: string
): Promise<void> {
  const supabase = getSupabaseServerClient()

  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('user_id', userId)
    .eq('post_id', postId)

  if (error) throw error
}

/**
 * 사용자의 모든 북마크 삭제
 */
export async function clearUserBookmarks(userId: string): Promise<void> {
  const supabase = getSupabaseServerClient()

  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('user_id', userId)

  if (error) throw error
}
