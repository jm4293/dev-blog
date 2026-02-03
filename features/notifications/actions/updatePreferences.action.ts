'use server';

import { createSupabaseServerClient } from '@/supabase/server.supabase';
import { checkRateLimit, RATE_LIMIT_CONFIG } from '@/utils/rate-limit';
import { captureException } from '@/sentry.config';
import { headers } from 'next/headers';

interface UpdatePreferencesResult {
  success: boolean;
  error?: string;
}

export async function updatePreferencesAction(new_post_enabled: boolean): Promise<UpdatePreferencesResult> {
  try {
    const headersList = headers();
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';

    if (!checkRateLimit(ip, RATE_LIMIT_CONFIG.AUTHENTICATED)) {
      return { success: false, error: 'Too many requests' };
    }

    if (typeof new_post_enabled !== 'boolean') {
      return { success: false, error: 'Missing required fields' };
    }

    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: 'Unauthorized' };
    }

    const { error } = await supabase.from('notification_preferences').upsert(
      {
        user_id: user.id,
        new_post_enabled,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    );

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    captureException(error, { action: 'updatePreferences' });
    return { success: false, error: 'Failed to update preferences' };
  }
}
