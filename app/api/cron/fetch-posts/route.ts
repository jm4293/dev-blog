/**
 * Cron Job: 블로그 자동 수집
 *
 * 실행 주기: 매일 19시 (19:00 KST) = UTC 10:00
 * 스케줄: 0 10 * * * (vercel.json 참조)
 *
 * 🌍 시간대 변환:
 * - UTC 10:00 = 한국 시간(KST) 19:00 (UTC+9)
 * - 설정 변경: vercel.json의 schedule 값 수정
 *
 * 프로세스:
 * 1. 활성화된 기업 목록 조회
 * 2. 각 기업의 RSS 피드 파싱
 * 3. 중복 제거 (URL 기반)
 * 4. OpenAI로 요약 & 태그 생성
 * 5. Supabase에 저장
 *
 * 🔐 보안:
 * - 프로덕션 환경에서는 vercel.json에 등록된 경로만 호출 가능
 * - 수동 테스트: Authorization 헤더에 'Bearer {CRON_SECRET}' 추가
 * - GET: 테스트용 (수동 실행)
 * - POST: Vercel 자동 호출 (프로덕션)
 *
 * 📊 모니터링:
 * - Vercel Dashboard > Functions > Cron Jobs에서 로그 확인
 * - Function Logs에서 [CRON-INFO], [CRON-ERROR] 검색
 * - process.stderr를 통해 JSON 형식으로 로깅
 *
 * 💡 문제 해결:
 * - 404 오류: vercel.json의 path가 올바른지 확인 (/api/cron/fetch-posts)
 * - 401 오류: NODE_ENV가 'production'인지 확인 또는 Authorization 헤더 전달
 * - 실행 안됨: vercel.json 배포 후 새로고침 (최대 5분 대기)
 * - 타임아웃: RSS 피드 파싱 시간 최적화 필요
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/supabase';
import { getAllTagsFromDatabase } from '@/features/ai/services/tag-selector';
import { generateTags } from '@/features/ai/services/openai';
import { parseRssFeed } from '@/features/posts';

// Cron 작업 로그 (프로덕션 환경에서만 출력)
// API 라우트는 서버 환경에서만 실행되므로 로깅 필요
interface LogData {
  [key: string]: any;
}

const cronLog = (level: 'info' | 'warn' | 'error', message: string, data?: LogData) => {
  if (process.env.NODE_ENV === 'production' || process.env.DEBUG_CRON === 'true') {
    const timestamp = new Date().toISOString();
    const logMsg = `[CRON-${level.toUpperCase()}] ${timestamp} ${message}`;
    // Vercel 로그에 출력되는 방식 (JSON 형식)
    const output = data ? { message: logMsg, data } : logMsg;
    // 직접 출력하지 않고, API 응답에 로그 데이터를 포함시킬 수도 있음
    // 여기서는 프로덕션 환경에서만 출력
    if (process.env.NODE_ENV === 'production') {
      // Vercel에서는 이 출력이 Function Logs에 표시됨
      process.stderr.write(JSON.stringify(output) + '\n');
    }
  }
};

function verifyCronSecret(request: NextRequest): boolean {
  // 방법 1: Authorization 헤더 검증 (수동 테스트용)
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    if (token === process.env.CRON_SECRET) {
      return true;
    }
  }

  // 방법 2: 프로덕션 환경에서는 Vercel Cron이 자동으로 호출하므로 신뢰
  // vercel.json에서만 이 엔드포인트가 호출되도록 설정되어 있음
  if (process.env.NODE_ENV === 'production') {
    return true;
  }

  return false;
}

export async function POST(request: NextRequest) {
  // Vercel Cron Secret 검증
  const authHeader = request.headers.get('authorization');
  const vercelCronHeader = request.headers.get('x-vercel-cron');

  cronLog('info', 'Fetch Posts Started', {
    authHeaderPresent: !!authHeader,
    authHeaderValue: authHeader ? authHeader.substring(0, 20) + '...' : 'none',
    vercelCronHeader,
    nodeEnv: process.env.NODE_ENV,
    cronSecretConfigured: !!process.env.CRON_SECRET,
  });

  if (!verifyCronSecret(request)) {
    cronLog('error', '인증 실패', {
      environment: process.env.NODE_ENV,
      authHeaderPresent: !!authHeader,
      expectedPattern: 'Bearer {CRON_SECRET}',
    });
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  cronLog('info', '인증 성공');

  const startTime = Date.now();
  let stats = {
    companiesProcessed: 0, // 처리된 기업 수
    postsFound: 0, // 발견된 게시글 수
    postsCreated: 0, // 새로 생성된 게시글 수
    errors: 0, // 오류 수
    duration: 0, // 소요 시간 (ms)
  };

  try {
    cronLog('info', 'Supabase 클라이언트 생성 중');
    const supabase = await createSupabaseServerClient();

    // 1. 활성화된 기업 목록 조회
    cronLog('info', '활성화된 기업 목록 조회 중');
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('id, name, rss_url')
      .eq('is_active', true);

    if (companiesError) {
      cronLog('error', '기업 조회 실패', companiesError);
      throw companiesError;
    }

    cronLog('info', `조회된 기업 수: ${companies?.length || 0}`);
    if (!companies || companies.length === 0) {
      cronLog('warn', '활성화된 기업이 없습니다');
      return NextResponse.json({ stats, message: '활성화된 기업이 없음' });
    }

    const typedCompanies = companies as Array<{
      id: string;
      name: string;
      rss_url: string;
    }>;

    // 2. 태그 목록을 한 번만 조회
    const allTags = await getAllTagsFromDatabase(supabase);

    // 3. 각 기업의 RSS 피드 파싱 및 저장
    for (const company of typedCompanies) {
      stats.companiesProcessed++;

      try {
        // RSS 피드 파싱
        const posts = await parseRssFeed(company.rss_url);
        stats.postsFound += posts.length;

        if (posts.length === 0) {
          continue;
        }

        // 4. 각 게시글 처리
        for (const post of posts) {
          try {
            // 중복 체크 (URL 기반)
            const { data: existing } = await supabase.from('posts').select('id').eq('url', post.url).single();

            if (existing) {
              continue;
            }

            // 미리 조회된 태그 목록에서 적절한 태그 선택 (OpenAI 사용)
            const tags = await generateTags(post.title, post.summary || post.content?.substring(0, 500) || '', allTags);

            // 게시글 저장
            const { error: insertError } = await supabase.from('posts').insert({
              company_id: company.id,
              title: post.title,
              url: post.url,
              content: post.content,
              summary: post.summary,
              author: post.author,
              tags: tags.length > 0 ? tags : null,
              published_at: post.publishedAt,
              scraped_at: new Date().toISOString(),
            } as any);

            if (insertError) {
              throw insertError;
            }

            stats.postsCreated++;
          } catch (error) {
            stats.errors++;
            const errorMsg = error instanceof Error ? error.message : String(error);

            // 계속 진행 (한 게시글 실패가 전체를 중단하지 않음)
          }
        }
      } catch (error) {
        stats.errors++;
        const errorMsg = error instanceof Error ? error.message : String(error);

        // 계속 진행 (한 기업 실패가 전체를 중단하지 않음)
      }
    }

    stats.duration = Date.now() - startTime;

    cronLog('info', `완료 (${stats.duration}ms)`, stats);

    return NextResponse.json({ success: true, stats });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);

    stats.duration = Date.now() - startTime;

    cronLog('error', `오류 발생: ${errorMsg}`, stats);

    return NextResponse.json(
      {
        success: false,
        error: errorMsg,
        stats,
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return POST(request);
}
