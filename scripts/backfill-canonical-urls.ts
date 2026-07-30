#!/usr/bin/env tsx

/**
 * canonical_url 백필 + 기존 중복 병합 (일회성 마이그레이션 스크립트)
 *
 * 사전 조건: supabase/migrations/022_add_canonical_url.sql 실행 완료
 * 이후 작업: 완료 후 023_canonical_url_unique.sql 실행
 *
 * 실행 방법:
 *   npx tsx scripts/backfill-canonical-urls.ts          # 드라이런 (변경 없이 계획만 출력)
 *   npx tsx scripts/backfill-canonical-urls.ts --apply  # 실제 적용
 *
 * 하는 일:
 *   1. 전체 posts의 url을 정규화해 canonical_url 채움
 *   2. 정규화 결과가 같은 중복 글 병합:
 *      - 가장 먼저 수집된 글(keeper)을 남김
 *      - 삭제될 글의 북마크/최근 본 글을 keeper로 이전 (이미 있으면 삭제)
 *      - 조회수/북마크 수를 keeper에 합산 후 중복 글 삭제
 */
import { createClient } from '@supabase/supabase-js';
import { existsSync, readFileSync } from 'node:fs';
import { normalizeUrl } from '@/utils/normalize-url';

// 로컬 실행 편의: env가 비어 있으면 프로젝트 루트 .env에서 로드
function loadLocalEnv() {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return;
  }
  const envPath = new URL('../.env', import.meta.url).pathname;
  if (!existsSync(envPath)) {
    return;
  }
  for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
    const match = line.match(/^([A-Z_]+)=(.*)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, '');
    }
  }
}

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
  url: string;
  created_at: string;
  view_count: number;
  bookmark_count: number;
  canonical_url: string | null;
}

async function main() {
  loadLocalEnv();

  const isApply = process.argv.includes('--apply');
  log(isApply ? '⚠️  적용 모드 (--apply): 실제로 DB를 변경합니다' : 'ℹ️  드라이런 모드: 변경 없이 계획만 출력합니다');

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // 0. 022 적용 여부 확인 (canonical_url 컬럼이 없으면 select가 실패한다)
  const probe = await supabase.from('posts').select('id, canonical_url').limit(1);
  if (probe.error) {
    throw new Error(
      `canonical_url 컬럼을 읽을 수 없습니다 — 022_add_canonical_url.sql을 먼저 실행하세요 (${probe.error.message})`,
    );
  }

  // 1. 전체 글 조회
  const posts: PostRow[] = [];
  const PAGE = 1000;
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from('posts')
      .select('id, url, created_at, view_count, bookmark_count, canonical_url')
      .order('created_at', { ascending: true })
      .range(from, from + PAGE - 1);
    if (error) throw error;
    posts.push(...((data as PostRow[]) || []));
    if (!data || data.length < PAGE) break;
  }
  log(`전체 글: ${posts.length}건`);

  // 2. 중복 그룹 계산 (created_at 오름차순 조회라 각 그룹의 첫 항목이 keeper)
  const byCanonical = new Map<string, PostRow[]>();
  for (const post of posts) {
    const canonical = normalizeUrl(post.url);
    byCanonical.set(canonical, [...(byCanonical.get(canonical) || []), post]);
  }
  const dupGroups = [...byCanonical.entries()].filter(([, group]) => group.length > 1);
  log(`중복 그룹: ${dupGroups.length}개 (삭제 대상 ${dupGroups.reduce((sum, [, g]) => sum + g.length - 1, 0)}건)`);

  // 3. 중복 병합
  for (const [canonical, group] of dupGroups) {
    const [keeper, ...losers] = group;
    log(`\n◆ ${canonical}\n  keeper: ${keeper.id} / 삭제: ${losers.map((l) => l.id).join(', ')}`);
    if (!isApply) continue;

    for (const loser of losers) {
      // 북마크/최근 본 글 이전 — keeper에 같은 사용자의 기록이 이미 있으면 loser 쪽을 삭제
      for (const table of ['bookmarks', 'recent_views'] as const) {
        const { data: loserRows, error: loserError } = await supabase
          .from(table)
          .select('id, user_id')
          .eq('post_id', loser.id);
        if (loserError) throw loserError;

        for (const row of (loserRows as Array<{ id: string; user_id: string }>) || []) {
          const { data: existing, error: existingError } = await supabase
            .from(table)
            .select('id')
            .eq('post_id', keeper.id)
            .eq('user_id', row.user_id)
            .limit(1);
          if (existingError) throw existingError;

          if (existing && existing.length > 0) {
            const { error } = await supabase.from(table).delete().eq('id', row.id);
            if (error) throw error;
            log(`  - ${table} ${row.id}: keeper에 이미 존재 → 삭제`);
          } else {
            const { error } = await supabase.from(table).update({ post_id: keeper.id }).eq('id', row.id);
            if (error) throw error;
            log(`  - ${table} ${row.id}: keeper로 이전`);
          }
        }
      }

      // 조회수/북마크 수 합산 (일회성 스크립트라 read-then-write로 충분)
      if (loser.view_count > 0 || loser.bookmark_count > 0) {
        const { error } = await supabase
          .from('posts')
          .update({
            view_count: keeper.view_count + loser.view_count,
            bookmark_count: keeper.bookmark_count + loser.bookmark_count,
          })
          .eq('id', keeper.id);
        if (error) throw error;
        keeper.view_count += loser.view_count;
        keeper.bookmark_count += loser.bookmark_count;
      }

      const { error: deleteError } = await supabase.from('posts').delete().eq('id', loser.id);
      if (deleteError) throw deleteError;
      log(`  ✓ 중복 글 삭제: ${loser.id}`);
    }
  }

  // 4. canonical_url 백필 (병합으로 삭제된 글 제외)
  const deletedIds = new Set(dupGroups.flatMap(([, group]) => group.slice(1).map((post) => post.id)));
  const targets = posts.filter((post) => !deletedIds.has(post.id) && post.canonical_url !== normalizeUrl(post.url));
  log(`\ncanonical_url 갱신 대상: ${targets.length}건`);

  if (isApply) {
    let updated = 0;
    await mapLimit(targets, 10, async (post) => {
      const { error } = await supabase
        .from('posts')
        .update({ canonical_url: normalizeUrl(post.url) })
        .eq('id', post.id);
      if (error) throw error;
      updated++;
      if (updated % 500 === 0) log(`  ...${updated}/${targets.length}`);
    });
    log(`✓ 백필 완료: ${updated}건`);

    // 5. 검증 — 023(UNIQUE) 실행 가능 여부
    const { count: nullCount, error: nullError } = await supabase
      .from('posts')
      .select('id', { count: 'exact', head: true })
      .is('canonical_url', null);
    if (nullError) throw nullError;

    log(`\n=== 검증 ===`);
    log(`canonical_url NULL: ${nullCount ?? '?'}건 (0이어야 함)`);
    log(
      nullCount === 0
        ? '✅ 023_canonical_url_unique.sql을 실행해도 됩니다'
        : '❌ NULL이 남아 있습니다 — 다시 실행하거나 원인을 확인하세요',
    );
  } else {
    log('\n드라이런 완료 — 적용하려면 --apply를 붙여 다시 실행하세요');
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    process.stderr.write(`\n❌ 실패: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exit(1);
  });
