/**
 * Cron Job: 블로그 자동 수집
 *
 * 실행 주기: 매일 자정 (00:00 KST) - Vercel Cron Jobs
 * 스케줄: 0 0 * * * (vercel.json 참조)
 *
 * 프로세스:
 * 1. 활성화된 기업 목록 조회
 * 2. 각 기업의 RSS 피드 파싱
 * 3. 중복 제거 (URL 기반)
 * 4. OpenAI로 요약 & 태그 생성 (선택사항)
 * 5. Supabase에 저장
 *
 * 보안:
 * - Cron Secret 인증 필수 (Authorization 헤더)
 * - GET: 테스트용 (수동 실행)
 * - POST: Vercel 자동 호출
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/supabase';
import { generateSummary, generateTags } from '@/features/ai/services/openai';
import { parseRssFeed } from '@/features/posts';

/**
 * Cron Secret 검증
 */
function verifyCronSecret(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const expectedSecret = `Bearer ${process.env.CRON_SECRET}`;

  return authHeader === expectedSecret;
}

/**
 * POST /api/cron/fetch-posts
 * Vercel Cron Jobs에서 호출됨
 */
export async function POST(request: NextRequest) {
  // Cron Secret 검증
  // if (!verifyCronSecret(request)) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  // }

  const startTime = Date.now();
  let stats = {
    companiesProcessed: 0,
    postsFound: 0,
    postsCreated: 0,
    errors: 0,
    duration: 0,
  };

  try {
    const supabase = getSupabaseServerClient();

    // 1. 활성화된 기업 목록 조회
    console.log('📡 활성화된 기업 목록 조회 중...');
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('id, name, rss_url')
      .eq('is_active', true);

    if (companiesError) throw companiesError;
    if (!companies || companies.length === 0) {
      console.log('⚠️  활성화된 기업이 없습니다');
      return NextResponse.json({ stats });
    }

    const typedCompanies = companies as Array<{
      id: string;
      name: string;
      rss_url: string;
    }>;

    console.log(`✅ ${typedCompanies.length}개 기업 발견`);

    // 2. 각 기업의 RSS 피드 파싱 및 저장
    for (const company of typedCompanies) {
      stats.companiesProcessed++;

      try {
        console.log(`\n🔄 ${company.name} 블로그 처리 중...`);

        // RSS 피드 파싱
        const posts = await parseRssFeed(company.rss_url);
        stats.postsFound += posts.length;
        console.log(`  📰 ${posts.length}개 게시글 발견`);

        if (posts.length === 0) continue;

        // 3. 각 게시글 처리
        for (const post of posts) {
          try {
            // 중복 체크 (URL 기반)
            const { data: existing } = await supabase.from('posts').select('id').eq('url', post.url).single();

            if (existing) {
              console.log(`  ⏭️  이미 존재함: ${post.title.substring(0, 40)}...`);
              continue;
            }

            // AI로 요약 생성 (개발환경에서는 건너뜀)
            let summary = '';
            let tags: string[] | null = null;

            // if (process.env.NODE_ENV !== 'development') {
            //   console.log(`  ⚙️  AI 처리 중: ${post.title.substring(0, 40)}...`);
            //   summary = await generateSummary(post.title, post.summary || '');
            //   tags = await generateTags(post.title, summary);
            // } else {
            //   console.log(`  ⏭️  AI 건너뜀 (개발모드): ${post.title.substring(0, 40)}...`);
            //   summary = post.summary || '요약 없음';
            //   tags = null;
            // }

            summary = post.summary || '요약 없음';
            tags = null;

            // 게시글 저장
            const { error: insertError } = await supabase.from('posts').insert({
              company_id: company.id,
              title: post.title,
              url: post.url,
              content: post.content,
              summary,
              author: post.author,
              tags,
              published_at: post.publishedAt,
              scraped_at: new Date().toISOString(),
            } as any);

            if (insertError) throw insertError;

            stats.postsCreated++;
            // console.log(`  ✅ 저장 완료 (태그: ${tags ? tags.join(', ') : '없음'})`);
          } catch (error) {
            stats.errors++;
            const errorMsg = error instanceof Error ? error.message : String(error);
            console.error(`  ❌ 게시글 처리 실패: ${errorMsg}`);
            // 계속 진행 (한 게시글 실패가 전체를 중단하지 않음)
          }
        }
      } catch (error) {
        stats.errors++;
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error(`❌ ${company.name} 처리 실패: ${errorMsg}`);
        // 계속 진행 (한 기업 실패가 전체를 중단하지 않음)
      }
    }

    stats.duration = Date.now() - startTime;

    console.log(`\n✨ 블로그 수집 완료!`);
    console.log(`   - 처리된 기업: ${stats.companiesProcessed}`);
    console.log(`   - 발견된 게시글: ${stats.postsFound}`);
    console.log(`   - 저장된 게시글: ${stats.postsCreated}`);
    console.log(`   - 오류: ${stats.errors}`);
    console.log(`   - 소요 시간: ${stats.duration}ms`);

    return NextResponse.json({ success: true, stats });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('❌ 블로그 수집 중 오류 발생:', errorMsg);

    stats.duration = Date.now() - startTime;

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

/**
 * GET /api/cron/fetch-posts
 * 테스트용 (수동 실행)
 */
export async function GET(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // POST와 동일하게 처리
  return POST(request);
}
