#!/usr/bin/env tsx

/**
 * 블로그 게시글 자동 수집 스크립트
 * GitHub Actions에서 주기적으로 실행됩니다.
 *
 * 실행 방법:
 * npx tsx scripts/fetch-posts.ts
 */

import { createClient } from '@supabase/supabase-js';
import { getAllTagsFromDatabase } from '@/features/ai/services/tag-selector';
import { generateTags } from '@/features/ai/services/openai';
import { parseRssFeed } from '@/features/posts';

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
};

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

  try {
    log('info', '블로그 게시글 수집 시작');

    // 환경 변수 검증
    validateEnv();

    // Supabase 클라이언트 생성 (Service Role Key 사용)
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // 1. 활성화된 기업 목록 조회
    log('info', '활성화된 기업 목록 조회 중');
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('id, name, rss_url')
      .eq('is_active', true);

    if (companiesError) {
      log('error', '기업 조회 실패', companiesError);
      throw companiesError;
    }

    log('info', `조회된 기업 수: ${companies?.length || 0}`);

    if (!companies || companies.length === 0) {
      log('warn', '활성화된 기업이 없습니다');
      return;
    }

    const typedCompanies = companies as Array<{
      id: string;
      name: string;
      rss_url: string;
    }>;

    // 2. 태그 목록을 한 번만 조회
    log('info', '태그 목록 조회 중');
    const allTags = await getAllTagsFromDatabase(supabase);
    log('info', `조회된 태그 수: ${allTags.length}`);

    // 3. 각 기업의 RSS 피드 파싱 및 저장
    for (const company of typedCompanies) {
      stats.companiesProcessed++;
      log('info', `처리 중: ${company.name} (${stats.companiesProcessed}/${typedCompanies.length})`);

      try {
        // RSS 피드 파싱
        const posts = await parseRssFeed(company.rss_url);
        stats.postsFound += posts.length;

        log('info', `${company.name}: ${posts.length}개 게시글 발견`);

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

            // 태그 생성 (OpenAI 사용)
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
            log('info', `새 게시글 저장: ${post.title.substring(0, 50)}...`);
          } catch (error) {
            stats.errors++;
            const errorMsg = error instanceof Error ? error.message : String(error);
            log('error', `게시글 처리 실패: ${errorMsg}`, { post: post.title });
          }
        }
      } catch (error) {
        stats.errors++;
        const errorMsg = error instanceof Error ? error.message : String(error);
        log('error', `${company.name} RSS 파싱 실패: ${errorMsg}`);
      }
    }

    stats.duration = Date.now() - startTime;

    log('info', '완료', stats);

    // 정상 종료
    process.exit(0);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    stats.duration = Date.now() - startTime;

    log('error', `치명적 오류 발생: ${errorMsg}`, stats);

    // 오류 종료
    process.exit(1);
  }
}

// 스크립트 실행
main();
