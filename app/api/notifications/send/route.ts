/**
 * Notifications Send API
 *
 * POST /api/notifications/send  — Push 알림 발송 (내부용)
 *
 * 호출자: GitHub Actions (scripts/fetch-posts.ts)
 * 인증: CRON_SECRET Bearer 토큰
 * Body: { postsCreated: number, posts?: CreatedPostInfo[] }
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';
import { secureCompare } from '@/utils/secure-compare';

// 구독 수가 많을 때 발송이 함수 기본 타임아웃에 걸리지 않도록 명시
export const maxDuration = 60;

// 동시 발송 제한 — 무제한 Promise.all은 구독이 늘면 FCM/APNs 429와 함수 타임아웃을 유발
const SEND_CONCURRENCY = 50;
const DELETE_CHUNK_SIZE = 500;

interface CreatedPostInfo {
  tags: string[];
  company_id: string;
  /** 매칭된 새 글이 1건일 때 원문으로 바로 이동시키기 위한 정보 (구버전 스크립트는 미전송) */
  url?: string;
  title?: string;
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

/** 유저의 관심사와 일치하는 새 글 목록 (관심사 미설정 = 전체) */
function matchPosts(pref: UserPreference, posts: CreatedPostInfo[]): CreatedPostInfo[] {
  const tags = pref.subscribed_tags || [];
  const companyIds = pref.subscribed_company_ids || [];

  if (tags.length === 0 && companyIds.length === 0) {
    return posts;
  }

  return posts.filter((post) => {
    const tagMatched = tags.length > 0 && (post.tags || []).some((tag) => tags.includes(tag));
    const companyMatched = companyIds.length > 0 && companyIds.includes(post.company_id);
    return tagMatched || companyMatched;
  });
}

function verifyCronSecret(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;

  const token = authHeader.substring(7);
  return secureCompare(token, process.env.CRON_SECRET);
}

// 동시성 제한 병렬 처리 헬퍼
async function mapLimit<T>(items: T[], limit: number, fn: (item: T) => Promise<void>): Promise<void> {
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      await fn(items[index]);
    }
  });
  await Promise.all(workers);
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
    const matchedByUser = new Map<string, { count: number; matched: CreatedPostInfo[] }>();
    for (const pref of preferences as UserPreference[]) {
      if (posts.length > 0) {
        const matched = matchPosts(pref, posts);
        if (matched.length > 0) {
          matchedByUser.set(pref.user_id, { count: matched.length, matched });
        }
      } else {
        matchedByUser.set(pref.user_id, { count: postsCreated, matched: [] });
      }
    }

    if (matchedByUser.size === 0) {
      return NextResponse.json({ success: true, message: 'No users matched by interests', sent: 0 });
    }

    // 3. 매칭된 유저들의 enabled = true인 구독 조회
    const { data: subscriptions, error: subError } = await supabase
      .from('push_subscriptions')
      .select('id, user_id, endpoint, p256dh, auth')
      .in('user_id', Array.from(matchedByUser.keys()))
      .eq('enabled', true);

    if (subError) {
      throw subError;
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ success: true, message: 'No active subscriptions', sent: 0 });
    }

    // 4. 유저별 개인화 메시지로 각 구독에 Push 발송
    const buildPayload = (userId: string) => {
      const entry = matchedByUser.get(userId) || { count: postsCreated, matched: [] };
      const isFiltered = entry.count < postsCreated;

      // 매칭된 새 글이 1건이면 클릭 시 원문으로 바로 이동
      const single = entry.matched.length === 1 && entry.matched[0].url ? entry.matched[0] : null;

      return JSON.stringify({
        title: 'devBlog.kr',
        body: single?.title
          ? `새 글: ${single.title}`
          : isFiltered
            ? `관심 분야의 새 글 ${entry.count}개가 등록되었습니다!`
            : `${entry.count}개의 새 포스트를 확인해보세요!`,
        icon: '/logo_192.png',
        badge: '/logo_32.png',
        tag: 'devblog-new-posts',
        url: single?.url || '/posts',
      });
    };

    let sent = 0;
    const expiredIds: string[] = [];
    const expiredEndpoints = new Set<string>();
    // 만료(410/404) 외의 실패도 집계한다 — 전면 장애가 sent:0 + 200 OK로 조용히 성공 처리되면 안 됨
    const failed = { rateLimited: 0, serverError: 0, other: 0 };

    await mapLimit(subscriptions, SEND_CONCURRENCY, async (sub) => {
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
        const statusCode = err instanceof Error && 'statusCode' in err ? (err as { statusCode: number }).statusCode : 0;

        if (statusCode === 410 || statusCode === 404) {
          // 만료된 구독 → 삭제 목록에 추가
          expiredIds.push(sub.id);
          expiredEndpoints.add(sub.endpoint);
        } else if (statusCode === 429) {
          failed.rateLimited++;
        } else if (statusCode >= 500) {
          failed.serverError++;
        } else {
          failed.other++;
          console.error('[notifications/send] push failed', {
            statusCode,
            message: err instanceof Error ? err.message : String(err),
          });
        }
      }
    });

    // 5. 만료된 구독 자동 삭제 (endpoint 대신 id로, 청크 단위 — URL 길이 제한 회피)
    for (let i = 0; i < expiredIds.length; i += DELETE_CHUNK_SIZE) {
      const chunk = expiredIds.slice(i, i + DELETE_CHUNK_SIZE);
      const { error: deleteError } = await supabase.from('push_subscriptions').delete().in('id', chunk);
      if (deleteError) {
        console.error('[notifications/send] expired subscription cleanup failed', deleteError);
      }
    }

    const result = {
      success: sent > 0 || subscriptions.length === expiredEndpoints.size,
      sent,
      total: subscriptions.length,
      expired: expiredIds.length,
      failed,
    };

    // 만료 외 사유로 한 건도 발송하지 못한 전면 실패는 200으로 위장하지 않는다
    if (sent === 0 && expiredIds.length < subscriptions.length) {
      console.error('[notifications/send] all sends failed', result);
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error(error, { method: 'POST', endpoint: '/api/notifications/send' });
    return NextResponse.json({ error: 'Failed to send notifications' }, { status: 500 });
  }
}
