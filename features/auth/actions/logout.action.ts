'use server';

import { createSupabaseServerClient } from '@/supabase/server.supabase';
import { revalidatePath } from 'next/cache';

export async function logoutAction() {
  try {
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    // 캐시 무효화
    revalidatePath('/', 'layout');

    // 홈페이지로 리다이렉트
    // redirect('/posts');
  } catch (error) {
    throw new Error('로그아웃에 실패했습니다');
  }
}
