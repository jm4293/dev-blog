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
import { createSupabaseServerClient } from '@/supabase';
import { getAllTagsFromDatabase } from '@/features/ai/services/tag-selector';
import { generateTags } from '@/features/ai/services/openai';
import { parseRssFeed } from '@/features/posts';

function verifyCronSecret(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const expectedSecret = `Bearer ${process.env.CRON_SECRET}`;

  return authHeader === expectedSecret;
}

export async function POST(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const startTime = Date.now();
  let stats = {
    companiesProcessed: 0, // 처리된 기업 수
    postsFound: 0, // 발견된 게시글 수
    postsCreated: 0, // 새로 생성된 게시글 수
    errors: 0, // 오류 수
    duration: 0, // 소요 시간 (ms)
  };

  try {
    const supabase = await createSupabaseServerClient();

    // 1. 활성화된 기업 목록 조회
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('id, name, rss_url')
      .eq('is_active', true);

    if (companiesError) {
      throw companiesError;
    }

    if (!companies || companies.length === 0) {
      return NextResponse.json({ stats });
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

    return NextResponse.json({ success: true, stats });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);

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

export async function GET(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return POST(request);
}
