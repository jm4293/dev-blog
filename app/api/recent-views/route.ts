/**
 * Recent Views API Routes
 *
 * GET /api/recent-views
 * 현재 사용자의 최근 본 글 조회
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/supabase/server.supabase';
import type { RecentViewsResponse } from '@/supabase/types.supabase';
import { checkRateLimit, extractIP, createRateLimitResponse, RATE_LIMIT_CONFIG } from '@/utils/rate-limit';
import { captureException } from '@/sentry.config';

interface ErrorResponse {
  error: string;
  details?: string;
}

// GET - 사용자의 최근 본 글 조회
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
      const response: RecentViewsResponse = {
        recentViews: [],
      };
      return NextResponse.json(response);
    }

    // 사용자의 최근 본 글 조회 (최신순)
    const { data: recentViews, error } = await supabase
      .from('recent_views')
      .select(
        `
        id,
        user_id,
        post_id,
        viewed_at,
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
      .order('viewed_at', { ascending: false })
      .limit(50); // 최대 50개

    if (error) {
      throw error;
    }

    const response: RecentViewsResponse = {
      recentViews: (recentViews as []) || [],
    };

    return NextResponse.json(response);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);

    captureException(error, {
      method: 'GET',
      endpoint: '/api/recent-views',
      errorMessage: errorMsg,
    });

    return NextResponse.json({ error: 'Failed to fetch recent views', details: errorMsg } as ErrorResponse, {
      status: 500,
    });
  }
}
