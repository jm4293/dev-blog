'use server';

import { createSupabaseServerClient } from '@/supabase/server.supabase';
import { checkRateLimit, extractIP, RATE_LIMIT_CONFIG } from '@/utils/rate-limit';
import { captureException } from '@/sentry.config';
import { headers } from 'next/headers';

interface AddBookmarkResult {
  success: boolean;
  error?: string;
  bookmarkId?: string;
}

/**
 * 즐겨찾기 추가 Server Action
 * @param postId - 게시글 ID
 * @returns AddBookmarkResult
 */
export async function createBookmarkAction(postId: string): Promise<AddBookmarkResult> {
  try {
    // Rate Limiting (인증 필요 API)
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
    const isAllowed = checkRateLimit(ip, RATE_LIMIT_CONFIG.AUTHENTICATED);

    if (!isAllowed) {
      return {
        success: false,
        error: 'Too many requests. Rate limit: 1000 requests per hour',
      };
    }

    // postId 검증
    if (!postId || typeof postId !== 'string') {
      return {
        success: false,
        error: 'post_id is required',
      };
    }

    const supabase = await createSupabaseServerClient();

    // 사용자 인증 확인
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        error: 'Unauthorized',
      };
    }

    // 즐겨찾기 추가
    const { data: bookmark, error } = await supabase
      .from('bookmarks')
      .insert({
        user_id: user.id,
        post_id: postId,
      })
      .select()
      .single();

    if (error) {
      // 중복 에러 처리
      if (error.code === '23505') {
        return {
          success: false,
          error: 'Already bookmarked',
        };
      }
      throw error;
    }

    return {
      success: true,
      bookmarkId: bookmark.id,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);

    captureException(error, {
      action: 'addBookmark',
      postId,
      errorMessage: errorMsg,
    });

    return {
      success: false,
      error: 'Failed to add bookmark',
    };
  }
}
