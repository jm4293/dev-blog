'use server';

import { createSupabaseServerClient } from '@/supabase';

export async function deleteRecentViewAction(postIds: string[]) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: 'Not logged in' };
  }

  const { error } = await supabase.from('recent_views').delete().eq('user_id', user.id).in('post_id', postIds);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true };
}

export async function clearAllRecentViews() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: 'Not logged in' };
  }

  const { error } = await supabase.from('recent_views').delete().eq('user_id', user.id);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true };
}
