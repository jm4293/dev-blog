'use client';

import { useMutation } from '@tanstack/react-query';
import { createSupabaseClient } from '@/supabase/client.supabase';

export function useGithubLogin() {
  return useMutation({
    // next: 로그인 완료 후 돌아갈 내부 경로 (callback 라우트가 isSafeRedirectPath로 검증)
    mutationFn: async (next?: string) => {
      const supabaseClient = createSupabaseClient();

      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      const callbackUrl = next
        ? `${siteUrl}/auth/callback?next=${encodeURIComponent(next)}`
        : `${siteUrl}/auth/callback`;

      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: callbackUrl,
        },
      });

      if (error) {
        throw new Error(error.message);
      }
    },
    onError: (error: Error) => {
      throw error;
    },
  });
}
