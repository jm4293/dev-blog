'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { createSupabaseClient } from '@/supabase/client.supabase';

export function useUser() {
  return useQuery({
    queryKey: queryKeys.auth.user,
    queryFn: async () => {
      const supabase = createSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user;
    },
    staleTime: 1000 * 60 * 5, // 5분간 캐시
    gcTime: 1000 * 60 * 10, // 10분간 메모리 유지
  });
}
