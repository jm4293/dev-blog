'use server';

import { createSupabaseServerClient } from '@/supabase/server.supabase';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export async function logoutAction() {
  try {
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    const cookieStore = cookies();

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
