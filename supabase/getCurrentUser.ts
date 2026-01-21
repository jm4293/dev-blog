import { cache } from 'react';
import { createSupabaseServerClient } from './server.supabase';

export const getCurrentUser = cache(async () => {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user;
  } catch (error) {
    return null;
  }
});
