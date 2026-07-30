'use client';

import { useMutation } from '@tanstack/react-query';
import { createSupabaseClient } from '@/supabase/client.supabase';

/** 로그인 후 복귀 경로를 콜백 라우트로 전달하는 단명 쿠키 */
const AUTH_NEXT_COOKIE = 'auth_next';

export function useGithubLogin() {
  return useMutation({
    // next: 로그인 완료 후 돌아갈 내부 경로 (callback 라우트가 isSafeRedirectPath로 검증)
    mutationFn: async (next?: string) => {
      const supabaseClient = createSupabaseClient();

      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

      // 복귀 경로는 redirectTo 쿼리가 아니라 쿠키로 전달한다.
      // redirectTo에 쿼리를 붙이면 Supabase의 Redirect URL 허용 목록과 불일치해
      // Auth 설정의 Site URL(예: localhost)로 폴백하는 문제가 있다.
      if (next) {
        document.cookie = `${AUTH_NEXT_COOKIE}=${encodeURIComponent(next)}; Max-Age=600; path=/; SameSite=Lax`;
      } else {
        document.cookie = `${AUTH_NEXT_COOKIE}=; Max-Age=0; path=/`;
      }

      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${siteUrl}/auth/callback`,
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
