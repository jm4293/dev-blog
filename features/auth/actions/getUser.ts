import { cache } from 'react';
import { createSupabaseServerClient } from '../../../supabase/server.supabase';

export const getUser = cache(async () => {
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
