/**
 * Bookmarks API Routes
 *
 * GET /api/bookmarks
 * 현재 사용자의 즐겨찾기 조회
 *
 * Note: POST, DELETE 메서드는 Server Actions로 마이그레이션됨
 * - addBookmark: features/bookmarks/actions/add.ts
 * - removeBookmark: features/bookmarks/actions/remove.ts
 */
import { NextRequest, NextResponse } from 'next/server';
import { captureException } from '@/sentry.config';
import { checkRateLimit, createRateLimitResponse, extractIP, RATE_LIMIT_CONFIG } from '@/utils';
import { createSupabaseServerClient } from '@/supabase/server.supabase';
import type { Bookmark, PostWithCompany } from '@/supabase/types.supabase';

interface BookmarksResponse {
  bookmarks: (Bookmark & { post: PostWithCompany })[];
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
