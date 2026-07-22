/**
 * Health Check API
 *
 * GET /api/health
 * 업타임 모니터(UptimeRobot 등)용 상태 확인 엔드포인트
 * - DB 연결과 최근 수집 시각을 함께 검증한다
 * - 수집이 STALE_HOURS 이상 멈춰 있으면 503을 반환해 수집 정체까지 감지 가능
 */
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, createRateLimitResponse, extractIP, RATE_LIMIT_CONFIG } from '@/utils';
import { createSupabaseStaticClient } from '@/supabase/static.supabase';

// 수집 주기가 6시간이므로 4주기(24시간) 이상 새 수집이 없으면 정체로 판단
const STALE_HOURS = 24;

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const ip = extractIP(request);
    const isAllowed = checkRateLimit(ip, RATE_LIMIT_CONFIG.PUBLIC);

    if (!isAllowed) {
      return createRateLimitResponse('Too many requests. Rate limit: 100 requests per hour');
    }

    const supabase = createSupabaseStaticClient();

    const { data, error } = await supabase
      .from('posts')
      .select('scraped_at')
      .order('scraped_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      throw error;
    }

    const lastScrapedAt = data?.scraped_at ?? null;
    const hoursSinceLastScrape = lastScrapedAt
      ? (Date.now() - new Date(lastScrapedAt).getTime()) / (1000 * 60 * 60)
      : Infinity;
    const isStale = hoursSinceLastScrape > STALE_HOURS;

    return NextResponse.json(
      {
        status: isStale ? 'degraded' : 'ok',
        lastScrapedAt,
        timestamp: new Date().toISOString(),
      },
      { status: isStale ? 503 : 200 },
    );
  } catch (error) {
    console.error(error, { method: 'GET', endpoint: '/api/health' });
    return NextResponse.json({ status: 'error', timestamp: new Date().toISOString() }, { status: 503 });
  }
}
