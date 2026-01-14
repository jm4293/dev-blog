import { useMutation } from '@tanstack/react-query';
import { createSupabaseClient } from '@/supabase/client.supabase';

export const useGitHubLogin = () => {
  return useMutation({
    mutationFn: async () => {
      const supabaseClient = createSupabaseClient();

      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
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
};
