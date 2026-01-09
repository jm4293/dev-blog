/**
 * Supabase 서버 클라이언트
 * - API 라우트에서만 사용
 * - Service Role Key 사용 (고권한)
 */

import { createClient } from '@supabase/supabase-js'

let serverInstance: ReturnType<typeof createClient> | null = null

export function getSupabaseServerClient() {
  if (serverInstance) {
    return serverInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase URL or Service Role Key')
  }

  serverInstance = createClient(supabaseUrl, supabaseServiceKey)
  return serverInstance
}

export default getSupabaseServerClient()
