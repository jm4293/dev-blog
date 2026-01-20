/**
 * Bookmarks API Routes
 *
 * GET /api/bookmarks
 * 현재 사용자의 즐겨찾기 조회
 *
 * POST /api/bookmarks
 * 게시글을 즐겨찾기에 추가
 * Body: { post_id: string }
 *
 * DELETE /api/bookmarks?postId=xxx
 * 즐겨찾기 삭제
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/supabase/server.supabase';
import type { PostWithCompany, Bookmark } from '@/supabase/types.supabase';
import { checkRateLimit, extractIP, createRateLimitResponse, RATE_LIMIT_CONFIG } from '@/utils/rate-limit';
import { captureException } from '@/sentry.config';

interface BookmarksResponse {
  bookmarks: (Bookmark & { post: PostWithCompany })[];
}

interface AddBookmarkRequest {
  post_id: string;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

// GET - 사용자의 즐겨찾기 조회
export async function GET(request: NextRequest) {
  try {
    // Rate Limiting (인증 필요 API)
    const ip = extractIP(request);
    const isAllowed = checkRateLimit(ip, RATE_LIMIT_CONFIG.AUTHENTICATED);

    if (!isAllowed) {
      return createRateLimitResponse('Too many requests. Rate limit: 1000 requests per hour');
    }

    const supabase = await createSupabaseServerClient();

    // 현재 로그인한 사용자 확인
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    // 로그인하지 않은 사용자는 빈 배열 반환 (200 OK)
    if (userError || !user) {
      const response: BookmarksResponse = {
        bookmarks: [],
      };
      return NextResponse.json(response);
    }

    // 사용자의 즐겨찾기 조회
    const { data: bookmarks, error } = await supabase
      .from('bookmarks')
      .select(
        `
        id,
        user_id,
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
      `,
      )
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    const response: BookmarksResponse = {
      bookmarks: (bookmarks as []) || [],
    };

    return NextResponse.json(response);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);

    captureException(error, {
      method: 'GET',
      endpoint: '/api/bookmarks',
      errorMessage: errorMsg,
    });

    return NextResponse.json({ error: 'Failed to fetch bookmarks', details: errorMsg }, { status: 500 });
  }
}

// POST - 즐겨찾기 추가
export async function POST(request: NextRequest) {
  try {
    // Rate Limiting (인증 필요 API)
    const ip = extractIP(request);
    const isAllowed = checkRateLimit(ip, RATE_LIMIT_CONFIG.AUTHENTICATED);

    if (!isAllowed) {
      return createRateLimitResponse('Too many requests. Rate limit: 1000 requests per hour');
    }

    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as AddBookmarkRequest;
    const { post_id } = body;

    if (!post_id) {
      return NextResponse.json({ error: 'post_id is required' } as ErrorResponse, { status: 400 });
    }

    const { data: bookmark, error } = await supabase
      .from('bookmarks')
      .insert({
        user_id: user.id,
        post_id,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Already bookmarked', details: error.message } as ErrorResponse, {
          status: 409,
        });
      }
      throw error;
    }

    return NextResponse.json(bookmark, { status: 201 });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);

    captureException(error, {
      method: 'POST',
      endpoint: '/api/bookmarks',
      errorMessage: errorMsg,
    });

    return NextResponse.json({ error: 'Failed to add bookmark', details: errorMsg } as ErrorResponse, { status: 500 });
  }
}

// DELETE - 즐겨찾기 삭제
export async function DELETE(request: NextRequest) {
  try {
    // Rate Limiting (인증 필요 API)
    const ip = extractIP(request);
    const isAllowed = checkRateLimit(ip, RATE_LIMIT_CONFIG.AUTHENTICATED);

    if (!isAllowed) {
      return createRateLimitResponse('Too many requests. Rate limit: 1000 requests per hour');
    }

    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const postId = request.nextUrl.searchParams.get('postId');

    if (!postId) {
      return NextResponse.json({ error: 'postId is required' } as ErrorResponse, { status: 400 });
    }

    const { error } = await supabase.from('bookmarks').delete().eq('user_id', user.id).eq('post_id', postId);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'Bookmark removed' });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);

    captureException(error, {
      method: 'DELETE',
      endpoint: '/api/bookmarks',
      errorMessage: errorMsg,
    });

    return NextResponse.json({ error: 'Failed to remove bookmark', details: errorMsg } as ErrorResponse, {
      status: 500,
    });
  }
}
