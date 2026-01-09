/**
 * Bookmarks API
 * GET: 사용자의 즐겨찾기 목록 조회
 * POST: 즐겨찾기 추가
 * DELETE: 즐겨찾기 삭제
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/shared/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseServerClient()

    // 쿼리 파라미터
    const searchParams = request.nextUrl.searchParams
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '20', 10))
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    const offset = (page - 1) * limit

    // 1. 전체 북마크 수
    const { count, error: countError } = await supabase
      .from('bookmarks')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)

    if (countError) throw countError

    const total = count || 0
    const totalPages = Math.ceil(total / limit)

    // 2. 북마크된 게시글 조회
    const { data: bookmarks, error: bookmarksError } = await supabase
      .from('bookmarks')
      .select(
        `
        id,
        post_id,
        created_at,
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

    if (bookmarksError) throw bookmarksError

    const posts = bookmarks?.map((b: any) => b.post) || []

    return NextResponse.json({
      posts,
      total,
      page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    })
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error('Bookmarks GET error:', errorMsg)

    return NextResponse.json(
      { error: 'Failed to fetch bookmarks', details: errorMsg },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServerClient()
    const body = await request.json()
    const { userId, postId } = body

    if (!userId || !postId) {
      return NextResponse.json(
        { error: 'userId and postId are required' },
        { status: 400 }
      )
    }

    // 북마크 추가
    const { data, error } = await supabase
      .from('bookmarks')
      .insert([{ user_id: userId, post_id: postId }] as any)
      .select()

    if (error) {
      // 중복 북마크인 경우
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Already bookmarked' },
          { status: 409 }
        )
      }
      throw error
    }

    return NextResponse.json({ success: true, bookmark: data?.[0] })
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error('Bookmarks POST error:', errorMsg)

    return NextResponse.json(
      { error: 'Failed to add bookmark', details: errorMsg },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = getSupabaseServerClient()
    const body = await request.json()
    const { userId, postId } = body

    if (!userId || !postId) {
      return NextResponse.json(
        { error: 'userId and postId are required' },
        { status: 400 }
      )
    }

    // 북마크 삭제
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('user_id', userId)
      .eq('post_id', postId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error('Bookmarks DELETE error:', errorMsg)

    return NextResponse.json(
      { error: 'Failed to delete bookmark', details: errorMsg },
      { status: 500 }
    )
  }
}
