/**
 * Supabase 클라이언트 (클라이언트사이드)
 * - 브라우저에서만 실행
 * - Anon Key 사용
 */

import { createClient } from '@supabase/supabase-js'

let clientInstance: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (clientInstance) {
    return clientInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase URL or Anon Key')
  }

  clientInstance = createClient(supabaseUrl, supabaseAnonKey)
  return clientInstance
}

export default getSupabaseClient()
