'use server';

import { createSupabaseServerClient } from '@/supabase';

export async function getRecentViewAction(postId: string) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: 'Not logged in' };
  }

  // UPSERT: 이미 있으면 viewed_at 업데이트
  const { error } = await supabase.from('recent_views').upsert(
    {
      user_id: user.id,
      post_id: postId,
      viewed_at: new Date().toISOString(),
    },
    {
      onConflict: 'user_id,post_id',
    },
  );

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true };
}
