/**
 * Single Post API Route
 *
 * GET /api/posts/[id]
 * 개별 게시글 조회
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/supabase/server.supabase';
import { checkRateLimit, extractIP, createRateLimitResponse, RATE_LIMIT_CONFIG } from '@/utils/rate-limit';
import { captureException } from '@/sentry.config';

interface ErrorResponse {
  error: string;
  details?: string;
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Rate Limiting
    const ip = extractIP(request);
    const isAllowed = checkRateLimit(ip, RATE_LIMIT_CONFIG.PUBLIC);

    if (!isAllowed) {
      return createRateLimitResponse('Too many requests. Rate limit: 100 requests per minute');
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' } as ErrorResponse, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();

    const { data: post, error } = await supabase
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
      `,
      )
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Post not found' } as ErrorResponse, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json(post);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);

    captureException(error, {
      method: 'GET',
      endpoint: '/api/posts/[id]',
      errorMessage: errorMsg,
    });

    return NextResponse.json({ error: 'Failed to fetch post', details: errorMsg } as ErrorResponse, { status: 500 });
  }
}
