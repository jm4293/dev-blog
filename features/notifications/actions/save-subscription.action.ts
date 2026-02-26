'use server';

import { createSupabaseServerClient } from '@/supabase/server.supabase';
import { checkRateLimit, RATE_LIMIT_CONFIG } from '@/utils/rate-limit';
import { captureException } from '@/sentry.config';
import { headers } from 'next/headers';

interface SaveSubscriptionResult {
  success: boolean;
  error?: string;
}

export async function saveSubscriptionAction(
  endpoint: string,
  p256dh: string,
  auth: string,
  device_os: string,
  browser: string,
): Promise<SaveSubscriptionResult> {
  try {
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip, RATE_LIMIT_CONFIG.AUTHENTICATED)) {
      return { success: false, error: 'Too many requests' };
    }

    if (!endpoint || !p256dh || !auth || !device_os || !browser) {
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

    // upsert: endpoint가 이미 있으면 업데이트, 없으면 insert
    const { error } = await supabase.from('push_subscriptions').upsert(
      {
        user_id: user.id,
        endpoint,
        p256dh,
        auth,
        device_os,
        browser,
        enabled: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'endpoint' },
    );

    if (error) throw error;

    return { success: true };
  } catch (error) {
    captureException(error, { action: 'saveSubscription' });
    return { success: false, error: 'Failed to save subscription' };
  }
}
