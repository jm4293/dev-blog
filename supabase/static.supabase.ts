import { createClient } from '@supabase/supabase-js';

/**
 * 쿠키가 없는 컨텍스트(generateStaticParams, sitemap 등 빌드 타임)에서 사용하는
 * 익명 클라이언트. anon key 기반이라 RLS가 그대로 적용된다 (공개 데이터 조회 전용).
 */
export function createSupabaseStaticClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
