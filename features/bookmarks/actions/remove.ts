'use server';

import { createSupabaseServerClient } from '@/supabase/server.supabase';
import { checkRateLimit, extractIP, RATE_LIMIT_CONFIG } from '@/utils/rate-limit';
import { captureException } from '@/sentry.config';
import { headers } from 'next/headers';

interface RemoveBookmarkResult {
  success: boolean;
  error?: string;
}

/**
 * 즐겨찾기 삭제 Server Action
 * @param postId - 게시글 ID
 * @returns RemoveBookmarkResult
 */
export async function removeBookmark(postId: string): Promise<RemoveBookmarkResult> {
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
        error: 'postId is required',
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

    // 즐겨찾기 삭제
    const { error } = await supabase.from('bookmarks').delete().eq('user_id', user.id).eq('post_id', postId);

    if (error) {
      throw error;
    }

    return {
      success: true,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);

    captureException(error, {
      action: 'removeBookmark',
      postId,
      errorMessage: errorMsg,
    });

    return {
      success: false,
      error: 'Failed to remove bookmark',
    };
  }
}
