import { createClient } from '@supabase/supabase-js';

let serverInstance: ReturnType<typeof createClient> | null = null;

export function getSupabaseServerClient() {
  if (serverInstance) {
    return serverInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables for server client (URL or Service Role Key)');
  }

  serverInstance = createClient(supabaseUrl, supabaseServiceKey);
  return serverInstance;
}
