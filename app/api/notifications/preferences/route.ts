/**
 * Notifications Preferences API Routes
 *
 * GET /api/notifications/preferences  — 알림 설정 + 등록된 기기 목록 조회
 * (PUT는 Server Action으로 이동)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/supabase/server.supabase';
import { checkRateLimit, extractIP, createRateLimitResponse, RATE_LIMIT_CONFIG } from '@/utils/rate-limit';
import { captureException } from '@/sentry.config';

// GET — 알림 설정 + 기기 목록 조회
export async function GET(request: NextRequest) {
  try {
    const ip = extractIP(request);
    if (!checkRateLimit(ip, RATE_LIMIT_CONFIG.AUTHENTICATED)) {
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

    // 알림 설정 조회 (없으면 기본값 반환)
    const { data: preferences } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // 등록된 기기 목록 조회
    const { data: subscriptions, error: subError } = await supabase
      .from('push_subscriptions')
      .select('id, endpoint, device_os, browser, enabled, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (subError) throw subError;

    return NextResponse.json({
      preferences: {
        new_post_enabled: preferences?.new_post_enabled ?? false, // 기본값 false
      },
      subscriptions: subscriptions || [],
    });
  } catch (error) {
    captureException(error, { method: 'GET', endpoint: '/api/notifications/preferences' });
    return NextResponse.json({ error: 'Failed to fetch preferences' }, { status: 500 });
  }
}
