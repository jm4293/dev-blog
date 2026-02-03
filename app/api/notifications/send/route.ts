/**
 * Notifications Send API
 *
 * POST /api/notifications/send  — Push 알림 발송 (내부용)
 *
 * 호출자: GitHub Actions (scripts/fetch-posts.ts)
 * 인증: CRON_SECRET Bearer 토큰
 * Body: { postsCreated: number }
 */

import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';
import { captureException } from '@/sentry.config';

interface SendBody {
  postsCreated: number;
}

// VAPID 설정 (한번만)
// Public Key는 클라이언트에서도 사용하므로 NEXT_PUBLIC_ 접두사 사용
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

// CRON_SECRET 인증 검증
function verifyCronSecret(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;

  const token = authHeader.substring(7);
  return token === process.env.CRON_SECRET;
}

// POST — Push 알림 발송
export async function POST(request: NextRequest) {
  try {
    // CRON_SECRET 인증
    if (!verifyCronSecret(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: SendBody = await request.json();
    const { postsCreated } = body;

    if (!postsCreated || postsCreated <= 0) {
      return NextResponse.json({ success: true, message: 'No posts to notify', sent: 0 });
    }

    // Service Role Key로 클라이언트 생성 (RLS 우회 — 모든 유저 조회 필요)
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

    // 1. new_post_enabled = true인 유저 조회
    const { data: preferences, error: prefError } = await supabase
      .from('notification_preferences')
      .select('user_id')
      .eq('new_post_enabled', true);

    if (prefError) {
      throw prefError;
    }

    if (!preferences || preferences.length === 0) {
      return NextResponse.json({ success: true, message: 'No users with notifications enabled', sent: 0 });
    }

    const userIds = preferences.map((p) => p.user_id);

    // 2. 해당 유저들의 enabled = true인 구독 조회
    const { data: subscriptions, error: subError } = await supabase
      .from('push_subscriptions')
      .select('id, endpoint, p256dh, auth')
      .in('user_id', userIds)
      .eq('enabled', true);

    if (subError) {
      throw subError;
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ success: true, message: 'No active subscriptions', sent: 0 });
    }

    // 3. 알림 메시지 구성
    const payload = JSON.stringify({
      title: 'devBlog.kr',
      body: `방금 ${postsCreated}개의 새 글이 등록되었습니다.`,
      icon: '/logo_192.png',
      badge: '/logo_32.png',
      tag: 'devblog-new-posts',
      url: '/posts',
    });

    // 4. 각 구독에 Push 발송
    let sent = 0;
    const failedEndpoints: string[] = [];

    await Promise.all(
      subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.p256dh,
                auth: sub.auth,
              },
            },
            payload,
          );
          sent++;
        } catch (err) {
          // 410 Gone 또는 404: 만료된 구독 → 삭제 목록에 추가
          const statusCode =
            err instanceof Error && 'statusCode' in err ? (err as { statusCode: number }).statusCode : 0;
          if (statusCode === 410 || statusCode === 404) {
            failedEndpoints.push(sub.endpoint);
          }
        }
      }),
    );

    // 5. 만료된 구독 자동 삭제
    if (failedEndpoints.length > 0) {
      await supabase.from('push_subscriptions').delete().in('endpoint', failedEndpoints);
    }

    return NextResponse.json({
      success: true,
      sent,
      total: subscriptions.length,
      expired: failedEndpoints.length,
    });
  } catch (error) {
    captureException(error, { method: 'POST', endpoint: '/api/notifications/send' });
    return NextResponse.json({ error: 'Failed to send notifications' }, { status: 500 });
  }
}
