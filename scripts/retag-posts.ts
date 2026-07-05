#!/usr/bin/env tsx

/**
 * 게시글 재태깅 스크립트
 * 새 태그를 tags 테이블에 추가한 뒤, 해당 주제의 기존 글에 태그를 다시 부여할 때 사용합니다.
 *
 * 실행 방법:
 * npx tsx scripts/retag-posts.ts "kafka|카프카"        # 제목/요약이 패턴에 매칭되는 글만
 * npx tsx scripts/retag-posts.ts --all                 # 전체 글 (OpenAI 비용 주의)
 */
import { createClient } from '@supabase/supabase-js';
import { generateTags, getAllTagsFromDatabase } from '@/features/ai';

const log = (message: string) => process.stdout.write(`${message}\n`);

async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;

  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await fn(items[index]);
    }
  });

  await Promise.all(workers);
  return results;
}

interface PostRow {
  id: string;
  title: string;
  summary: string | null;
  tags: string[] | null;
}

async function main() {
  const arg = process.argv[2];
  if (!arg) {
    log('사용법: npx tsx scripts/retag-posts.ts "<정규식 패턴>" 또는 --all');
    process.exit(1);
  }

  const pattern = arg === '--all' ? null : new RegExp(arg, 'i');

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const allTags = await getAllTagsFromDatabase(supabase);
  log(`태그 ${allTags.length}개 로드`);

  // 전체 글 페이지네이션 조회
  const posts: PostRow[] = [];
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await supabase
      .from('posts')
      .select('id, title, summary, tags')
      .order('id')
      .range(offset, offset + 999);

    if (error) {
      throw error;
    }
    posts.push(...((data || []) as PostRow[]));
    if (!data || data.length < 1000) {
      break;
    }
  }

  const targets = pattern ? posts.filter((post) => pattern.test(`${post.title} ${post.summary || ''}`)) : posts;
  log(`대상 글: ${targets.length}/${posts.length}개`);

  let updated = 0;
  let failed = 0;

  await mapLimit(targets, 5, async (post) => {
    try {
      const tags = await generateTags(post.title, post.summary || '', allTags);
      if (tags.length === 0) {
        return;
      }

      const { error } = await supabase
        .from('posts')
        .update({ tags } as never)
        .eq('id', post.id);

      if (error) {
        throw error;
      }
      updated++;
      if (updated % 50 === 0) {
        log(`  진행: ${updated}/${targets.length}`);
      }
    } catch (error) {
      failed++;
      const errorMsg = error instanceof Error ? error.message : String(error);
      log(`  ✗ 실패 (${post.title.substring(0, 40)}): ${errorMsg}`);
    }
  });

  log(`✅ 완료: ${updated}개 갱신 / ${failed}개 실패`);
  process.exit(0);
}

main();
