'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { createSupabaseServerClient } from '@/supabase/server.supabase';

export async function logoutAction(pushEndpoint?: string) {
  try {
    const supabase = await createSupabaseServerClient();

    // 로그아웃하는 기기의 push 구독 삭제 — 로그아웃 후 이 기기로 알림이 가지 않도록
    // (signOut 전에 실행해야 세션 기반 RLS로 본인 행만 삭제 가능)
    if (pushEndpoint) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // 구독 삭제 실패가 로그아웃 자체를 막지 않도록 에러는 무시
        await supabase.from('push_subscriptions').delete().eq('user_id', user.id).eq('endpoint', pushEndpoint);
      }
    }

    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    const cookieStore = await cookies();

    cookieStore.getAll().forEach((cookie) => {
      if (cookie.name.startsWith('sb-')) {
        cookieStore.delete(cookie.name);
      }
    });

    revalidatePath('/', 'layout');

    return { success: true };
  } catch (error) {
    throw new Error('로그아웃에 실패했습니다');
  }
}
