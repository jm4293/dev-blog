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
import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';
import { secureCompare } from '@/utils/secure-compare';

interface CreatedPostInfo {
  tags: string[];
  company_id: string;
}

interface SendBody {
  postsCreated: number;
  /** 새로 저장된 글의 태그/회사 정보 (관심사 필터링용, 없으면 전원에게 발송) */
  posts?: CreatedPostInfo[];
}

interface UserPreference {
  user_id: string;
  subscribed_tags: string[] | null;
  subscribed_company_ids: string[] | null;
}

/** 유저의 관심사와 일치하는 새 글 수 (관심사 미설정 = 전체) */
function countMatchedPosts(pref: UserPreference, posts: CreatedPostInfo[]): number {
  const tags = pref.subscribed_tags || [];
  const companyIds = pref.subscribed_company_ids || [];

  if (tags.length === 0 && companyIds.length === 0) {
    return posts.length;
  }

  return posts.filter((post) => {
    const tagMatched = tags.length > 0 && (post.tags || []).some((tag) => tags.includes(tag));
    const companyMatched = companyIds.length > 0 && companyIds.includes(post.company_id);
    return tagMatched || companyMatched;
  }).length;
}

function verifyCronSecret(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;

  const token = authHeader.substring(7);
  return secureCompare(token, process.env.CRON_SECRET);
}

// POST — Push 알림 발송
export async function POST(request: NextRequest) {
  try {
    // CRON_SECRET 인증
    if (!verifyCronSecret(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // VAPID 설정 (런타임에 설정하여 빌드 시 env 미설정 오류 방지)
    webpush.setVapidDetails(
      process.env.VAPID_SUBJECT!,
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
      process.env.VAPID_PRIVATE_KEY!,
    );

    const body: SendBody = await request.json();
    const { postsCreated, posts = [] } = body;

    if (!postsCreated || postsCreated <= 0) {
      return NextResponse.json({ success: true, message: 'No posts to notify', sent: 0 });
    }

    // Service Role Key로 클라이언트 생성 (RLS 우회 — 모든 유저 조회 필요)
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

    // 1. new_post_enabled = true인 유저의 관심사 조회
    const { data: preferences, error: prefError } = await supabase
      .from('notification_preferences')
      .select('user_id, subscribed_tags, subscribed_company_ids')
      .eq('new_post_enabled', true);

    if (prefError) {
      throw prefError;
    }

    if (!preferences || preferences.length === 0) {
      return NextResponse.json({ success: true, message: 'No users with notifications enabled', sent: 0 });
    }

    // 2. 유저별 관심사 매칭 (글 상세 정보가 없으면 전원에게 전체 개수로 발송)
    const matchedCountByUser = new Map<string, number>();
    for (const pref of preferences as UserPreference[]) {
      const matched = posts.length > 0 ? countMatchedPosts(pref, posts) : postsCreated;
      if (matched > 0) {
        matchedCountByUser.set(pref.user_id, matched);
      }
    }

    if (matchedCountByUser.size === 0) {
      return NextResponse.json({ success: true, message: 'No users matched by interests', sent: 0 });
    }

    // 3. 매칭된 유저들의 enabled = true인 구독 조회
    const { data: subscriptions, error: subError } = await supabase
      .from('push_subscriptions')
      .select('id, user_id, endpoint, p256dh, auth')
      .in('user_id', Array.from(matchedCountByUser.keys()))
      .eq('enabled', true);

    if (subError) {
      throw subError;
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ success: true, message: 'No active subscriptions', sent: 0 });
    }

    // 4. 유저별 개인화 메시지로 각 구독에 Push 발송
    const buildPayload = (userId: string) => {
      const matched = matchedCountByUser.get(userId) || postsCreated;
      const isFiltered = matched < postsCreated;

      return JSON.stringify({
        title: 'devBlog.kr',
        body: isFiltered
          ? `관심 분야의 새 글 ${matched}개가 등록되었습니다!`
          : `${matched}개의 새 포스트를 확인해보세요!`,
        icon: '/logo_192.png',
        badge: '/logo_32.png',
        tag: 'devblog-new-posts',
        url: '/posts',
      });
    };

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
            buildPayload(sub.user_id),
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
    console.error(error, { method: 'POST', endpoint: '/api/notifications/send' });
    return NextResponse.json({ error: 'Failed to send notifications' }, { status: 500 });
  }
}
