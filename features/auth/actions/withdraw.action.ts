'use server';

import { createSupabaseServerClient, createSupabaseAdminClient } from '@/supabase/server.supabase';
import { revalidatePath } from 'next/cache';

export async function withdrawAction() {
  try {
    const supabase = await createSupabaseServerClient();

    // 현재 로그인한 사용자 확인
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('사용자를 확인할 수 없습니다');
    }

    const userId = user.id;

    // 1. 사용자의 북마크 삭제 (hard delete)
    const { error: bookmarkError } = await supabase.from('bookmarks').delete().eq('user_id', userId);

    if (bookmarkError) {
      throw new Error('북마크 삭제에 실패했습니다');
    }

    // 2. Admin 클라이언트로 사용자 계정 삭제
    const adminSupabase = await createSupabaseAdminClient();
    const { error: authError } = await adminSupabase.auth.admin.deleteUser(userId);

    if (authError) {
      throw new Error('계정 삭제에 실패했습니다');
    }

    // 3. 로그아웃 (쿠키 제거 및 세션 종료)
    await supabase.auth.signOut();

    // 캐시 무효화
    revalidatePath('/', 'layout');

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : '회원탈퇴에 실패했습니다';
    throw new Error(message);
  }
}
