#!/usr/bin/env tsx

/**
 * 블로그 게시글 자동 수집 스크립트
 * GitHub Actions에서 주기적으로 실행됩니다.
 *
 * 실행 방법:
 * npx tsx scripts/fetch-posts.ts
 */
import { createClient } from '@supabase/supabase-js';
import { generateTags, getAllTagsFromDatabase } from '@/features/ai';
import { FeedFetchError, parseRssFeed } from '@/features/posts/services/rss-parser';

// Medium 인프라를 쓰는 커스텀 도메인 — medium.com과 rate limit을 공유하므로 같은 레인에서 순차 처리
// (피드 <generator>Medium</generator>으로 판별, 새 Medium 블로그 추가 시 여기에도 등록)
const MEDIUM_CUSTOM_HOSTS = new Set([
  'techblog.gccompany.co.kr', // 여기어때
  'teamblog.joonggonara.co.kr', // 중고나라
  'techblog.lotteon.com', // 롯데온
  'techblog.yogiyo.co.kr', // 요기요
  'tech.remember.co.kr', // 리멤버
  'blog.mathpresso.com', // 매스프레소
  'team.modusign.co.kr', // 모두싸인
  'techblog.pet-friends.co.kr', // 펫프렌즈
  'techblog.catenoid.net', // 카테노이드
]);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 환경 변수 검증
function validateEnv() {
  const required = ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

// 로그 헬퍼
interface LogData {
  [key: string]: any;
}

const log = (level: 'info' | 'warn' | 'error', message: string, data?: LogData) => {
  const timestamp = new Date().toISOString();
  const prefix = `[${level.toUpperCase()}] ${timestamp}`;

  if (data) {
    process.stdout.write(`${prefix} ${message} ${JSON.stringify(data, null, 2)}\n`);
  } else {
    process.stdout.write(`${prefix} ${message}\n`);
  }
};

// 동시성 제한 병렬 처리 헬퍼
async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T, index: number) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;

  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await fn(items[index], index);
    }
  });

  await Promise.all(workers);
  return results;
}

// 메인 함수
async function main() {
  const startTime = Date.now();
  let stats = {
    companiesProcessed: 0,
    postsFound: 0,
    postsCreated: 0,
    errors: 0,
    duration: 0,
  };

  // RSS 파싱에 실패한 블로그 목록 (실행 결과에서 한눈에 확인용)
  const failedCompanies: Array<{ name: string; reason: string }> = [];

  // 새로 저장된 글의 태그/회사 정보 (Push 알림 관심사 필터링용)
  const createdPosts: Array<{ tags: string[]; company_id: string }> = [];

  try {
    log('info', '🚀 블로그 게시글 수집 시작');

    // 환경 변수 검증
    validateEnv();
    log('info', '✓ 환경 변수 검증 완료');

    // Supabase 클라이언트 생성 (Service Role Key 사용)
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    log('info', '✓ Supabase 클라이언트 생성 완료');

    // 1. 활성화된 기업 목록 조회
    log('info', '📋 활성화된 블로그 목록 조회 중...');
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('id, name, rss_url')
      .eq('is_active', true);

    if (companiesError) {
      log('error', '❌ 블로그 조회 실패', companiesError);
      throw companiesError;
    }

    log('info', `✓ 총 ${companies?.length || 0}개 블로그 발견`);

    if (!companies || companies.length === 0) {
      log('warn', '⚠️ 활성화된 블로그가 없습니다');
      return;
    }

    const typedCompanies = companies as Array<{
      id: string;
      name: string;
      rss_url: string;
    }>;

    // 2. 태그 목록을 한 번만 조회
    log('info', '🏷️  태그 목록 조회 중...');
    const allTags = await getAllTagsFromDatabase(supabase);
    log('info', `✓ 총 ${allTags.length}개 태그 로드 완료`);

    // 3. 각 기업의 RSS 피드 병렬 파싱
    // 같은 레인(호스트)은 순차 처리해서 rate limit(429) 방지, 레인 간에는 동시 8개
    // Medium 커스텀 도메인(techblog.lotteon.com 등)은 medium.com과 rate limit을 공유하므로 한 레인으로 묶음
    log('info', '📡 RSS 피드 수집 시작...\n');
    const byLane = new Map<string, typeof typedCompanies>();
    for (const company of typedCompanies) {
      let host = '';
      try {
        host = new URL(company.rss_url).hostname;
      } catch {
        host = company.rss_url;
      }
      const lane = host === 'medium.com' || MEDIUM_CUSTOM_HOSTS.has(host) ? 'medium' : host;
      byLane.set(lane, [...(byLane.get(lane) || []), company]);
    }

    // 재시도 정책:
    // - 429: Retry-After 헤더 우선(최대 60초), 없으면 점증 백오프(10초 → 30초)
    // - 타임아웃: 점증 백오프(10초 → 30초)
    // - 404/5xx: 간헐 장애(flex 등)일 수 있어 3초 후 재시도
    // - 403/406은 rss-parser가 브라우저 헤더로 이미 폴백했으므로 재시도 없이 실패 처리
    const parseWithRetry = async (rssUrl: string) => {
      const backoffDelays = [10000, 30000];
      for (let attempt = 0; ; attempt++) {
        try {
          return await parseRssFeed(rssUrl);
        } catch (error) {
          if (attempt >= backoffDelays.length) {
            throw error;
          }

          const status = error instanceof FeedFetchError ? error.status : 0;
          const errorMsg = error instanceof Error ? error.message : String(error);
          const isRateLimited = status === 429;
          const isTransient = status === 404 || status >= 500 || errorMsg.includes('timed out');

          if (!isRateLimited && !isTransient) {
            throw error;
          }

          let waitMs = isRateLimited || errorMsg.includes('timed out') ? backoffDelays[attempt] : 3000;
          if (isRateLimited && error instanceof FeedFetchError && error.retryAfterSeconds) {
            waitMs = Math.min(error.retryAfterSeconds * 1000, 60000);
          }
          await sleep(waitMs);
        }
      }
    };

    const feedResults = (
      await mapLimit(Array.from(byLane.entries()), 8, async ([lane, group]) => {
        // Medium은 연속 요청에 민감해서 성공해도 요청 간 3초 간격 유지
        const requestGapMs = lane === 'medium' ? 3000 : 500;
        const results = [];
        for (let i = 0; i < group.length; i++) {
          const company = group[i];
          try {
            results.push({ company, posts: await parseWithRetry(company.rss_url) });
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : String(error);
            results.push({ company, posts: null, reason: errorMsg });
          }
          if (i < group.length - 1) {
            await sleep(requestGapMs);
          }
        }
        return results;
      })
    ).flat();

    // 4. 기업별로 중복 제거 후 저장
    for (const result of feedResults) {
      const { company, posts } = result;
      stats.companiesProcessed++;
      log('info', `[${stats.companiesProcessed}/${typedCompanies.length}] 처리 중: ${company.name}`);

      if (!posts) {
        stats.errors++;
        failedCompanies.push({ name: company.name, reason: result.reason || '알 수 없는 오류' });
        log('error', `  ✗ ${company.name} RSS 파싱 실패: ${result.reason}`);
        continue;
      }

      stats.postsFound += posts.length;
      log('info', `  └─ ${posts.length}개 게시글 발견`);

      if (posts.length === 0) {
        continue;
      }

      try {
        // 피드 내 중복 URL 제거
        const uniquePosts = Array.from(new Map(posts.map((post) => [post.url, post])).values());

        // 중복 체크 (URL 기반, 배치 조회)
        const urls = uniquePosts.map((post) => post.url);
        const { data: existing, error: existingError } = await supabase.from('posts').select('url').in('url', urls);

        if (existingError) {
          throw existingError;
        }

        const existingUrls = new Set((existing || []).map((row: { url: string }) => row.url));
        const newPosts = uniquePosts.filter((post) => !existingUrls.has(post.url));

        if (newPosts.length === 0) {
          continue;
        }

        // 태그 생성 (OpenAI, 동시 5개) — 본문은 태그 생성에만 사용하고 저장하지 않음 (저작권)
        const rows = await mapLimit(newPosts, 5, async (post) => {
          let tags: string[] = [];
          try {
            tags = await generateTags(post.title, post.summary || post.content?.substring(0, 500) || '', allTags);
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : String(error);
            log('warn', `  ⚠️ 태그 생성 실패 (태그 없이 저장): ${errorMsg}`, { title: post.title });
          }

          return {
            company_id: company.id,
            title: post.title,
            url: post.url,
            summary: post.summary,
            author: post.author,
            tags: tags.length > 0 ? tags : null,
            published_at: post.publishedAt,
            scraped_at: new Date().toISOString(),
          };
        });

        // 게시글 배치 저장 (URL 충돌 시 무시)
        const { error: insertError } = await supabase
          .from('posts')
          .upsert(rows as any, { onConflict: 'url', ignoreDuplicates: true });

        if (insertError) {
          throw insertError;
        }

        stats.postsCreated += rows.length;
        createdPosts.push(...rows.map((row) => ({ tags: row.tags || [], company_id: company.id })));
        log('info', `  ✓ 새 게시글 ${rows.length}개 저장`);
      } catch (error) {
        stats.errors++;
        const errorMsg = error instanceof Error ? error.message : String(error);
        failedCompanies.push({ name: company.name, reason: errorMsg });
        log('error', `  ✗ ${company.name} 게시글 저장 실패: ${errorMsg}`);
      }
    }

    stats.duration = Date.now() - startTime;

    log('info', '\n✅ 수집 완료!');
    log('info', '📊 실행 결과:', {
      '처리한 블로그 수': stats.companiesProcessed,
      '발견한 게시글 수': stats.postsFound,
      '새로 저장한 게시글 수': stats.postsCreated,
      '에러 수': stats.errors,
      '소요 시간': `${(stats.duration / 1000).toFixed(2)}초`,
    });

    // RSS가 죽은 블로그를 놓치지 않도록 실패 목록을 명시적으로 출력
    if (failedCompanies.length > 0) {
      log('warn', `⚠️ 수집 실패 블로그 ${failedCompanies.length}개 — RSS URL 점검 필요:`, {
        failed: failedCompanies,
      });
    }

    // 새 글이 저장된 경우 ISR 캐시 갱신 및 Push 알림 발송
    if (stats.postsCreated > 0) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

      // ISR 캐시 갱신
      log('info', '🔄 ISR 캐시 갱신 중...');
      try {
        const revalidateSecret = process.env.REVALIDATE_SECRET;

        if (!siteUrl || !revalidateSecret) {
          log('warn', '⚠️ ISR 갱신 설정 미완료 (NEXT_PUBLIC_SITE_URL 또는 REVALIDATE_SECRET 미설정)');
        } else {
          // 시크릿은 URL 쿼리(액세스 로그에 평문으로 남음) 대신 Authorization 헤더로 전달
          const revalidateResponse = await fetch(`${siteUrl}/api/revalidate?path=/posts`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${revalidateSecret}` },
          });

          if (revalidateResponse.ok) {
            const revalidateResult = await revalidateResponse.json();
            log('info', '✅ ISR 캐시 갱신 완료', revalidateResult);
          } else {
            const revalidateError = await revalidateResponse.json();
            log('error', '❌ ISR 캐시 갱신 실패', revalidateError);
          }
        }
      } catch (revalidateError) {
        // ISR 갱신 실패는 수집 자체를 실패시키지 않음
        const errorMsg = revalidateError instanceof Error ? revalidateError.message : String(revalidateError);
        log('error', '❌ ISR 캐시 갱신 요청 에러:', { error: errorMsg });
      }

      // Push 알림 발송
      log('info', '\n🔔 Push 알림 발송 중...');
      try {
        if (!siteUrl) {
          log('warn', '⚠️ NEXT_PUBLIC_SITE_URL 미설정 — Push 알림 건너뜀');
        } else {
          const notifyResponse = await fetch(`${siteUrl}/api/notifications/send`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.CRON_SECRET}`,
            },
            body: JSON.stringify({ postsCreated: stats.postsCreated, posts: createdPosts }),
          });

          const notifyResult = await notifyResponse.json();

          if (notifyResponse.ok) {
            log('info', '🔔 Push 알림 발송 완료', notifyResult);
          } else {
            log('error', '❌ Push 알림 발송 실패', notifyResult);
          }
        }
      } catch (notifyError) {
        // Push 알림 실패는 수집 자체를 실패시키지 않음
        const errorMsg = notifyError instanceof Error ? notifyError.message : String(notifyError);
        log('error', '❌ Push 알림 요청 에러:', { error: errorMsg });
      }
    }

    // 실패율이 임계치를 넘으면 워크플로우가 실패로 표시되도록 비정상 종료
    // (개별 피드 실패가 조용히 누적되어 특정 블로그 수집이 장기간 끊기는 것을 방지)
    const FAILURE_RATE_THRESHOLD = 0.3;
    const failureRate = stats.companiesProcessed > 0 ? failedCompanies.length / stats.companiesProcessed : 0;

    if (failureRate >= FAILURE_RATE_THRESHOLD) {
      log(
        'error',
        `❌ 수집 실패율 ${(failureRate * 100).toFixed(0)}%가 임계치(${FAILURE_RATE_THRESHOLD * 100}%) 이상 — 비정상 종료`,
        { failed: failedCompanies },
      );
      process.exit(1);
    }

    // 정상 종료
    process.exit(0);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    stats.duration = Date.now() - startTime;

    log('error', '\n❌ 치명적 오류 발생!');
    log('error', `오류 메시지: ${errorMsg}`);
    log('error', '📊 실행 결과:', stats);

    // 오류 종료
    process.exit(1);
  }
}

// 스크립트 실행
main();
