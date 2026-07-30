'use server';

import { createSupabaseServerClient } from '@/supabase/server.supabase';

interface LocalRecentViewInput {
  postId: string;
  viewedAt: string;
}

const MAX_SYNC_ITEMS = 20;

/**
 * 비로그인 상태에서 localStorage에 쌓인 열람 기록을 로그인 직후 계정(DB)으로 1회 이관
 *
 * 이관하지 않으면 로그인하는 순간 조회 소스가 DB로 바뀌면서
 * 그동안의 최근 본 글 목록이 통째로 사라져 보인다.
 */
export async function syncRecentViewsAction(views: LocalRecentViewInput[]) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false as const, message: 'Not logged in' };
  }

  // 입력 검증 + 상한 (localStorage 값은 신뢰할 수 없는 클라이언트 입력)
  const candidates = (Array.isArray(views) ? views : [])
    .slice(0, MAX_SYNC_ITEMS)
    .filter(
      (view) =>
        typeof view?.postId === 'string' &&
        view.postId.length > 0 &&
        typeof view?.viewedAt === 'string' &&
        !Number.isNaN(Date.parse(view.viewedAt)),
    );

  if (candidates.length === 0) {
    return { success: true as const, synced: 0 };
  }

  // 삭제된 글의 postId가 섞여 있으면 FK 위반으로 배치 전체가 실패하므로 존재하는 글만 남긴다
  const { data: existingPosts, error: postsError } = await supabase
    .from('posts')
    .select('id')
    .in(
      'id',
      candidates.map((view) => view.postId),
    );

  if (postsError) {
    return { success: false as const, message: postsError.message };
  }

  const existingIds = new Set((existingPosts || []).map((row: { id: string }) => row.id));
  const rows = candidates
    .filter((view) => existingIds.has(view.postId))
    .map((view) => ({
      user_id: user.id,
      post_id: view.postId,
      viewed_at: new Date(view.viewedAt).toISOString(),
    }));

  if (rows.length === 0) {
    return { success: true as const, synced: 0 };
  }

  // 이미 DB에 있는 기록은 유지한다 (DB의 viewed_at이 최신일 수 있으므로 덮어쓰지 않음)
  const { error } = await supabase
    .from('recent_views')
    .upsert(rows, { onConflict: 'user_id,post_id', ignoreDuplicates: true });

  if (error) {
    return { success: false as const, message: error.message };
  }

  return { success: true as const, synced: rows.length };
}
