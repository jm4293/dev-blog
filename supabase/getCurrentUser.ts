import { createSupabaseServerClient } from './server.supabase';

export async function getCurrentUser() {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user;
  } catch (error) {
    return null;
  }
}
