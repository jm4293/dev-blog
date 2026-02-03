'use server';

import { createSupabaseServerClient } from '@/supabase/server.supabase';
import { checkRateLimit, RATE_LIMIT_CONFIG } from '@/utils/rate-limit';
import { captureException } from '@/sentry.config';
import { headers } from 'next/headers';

interface UpdateSubscriptionEnabledResult {
  success: boolean;
  error?: string;
}

export async function updateSubscriptionEnabledAction(
  device_os: string,
  enabled: boolean,
): Promise<UpdateSubscriptionEnabledResult> {
  try {
    const headersList = headers();

    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip, RATE_LIMIT_CONFIG.AUTHENTICATED)) {
      return { success: false, error: 'Too many requests' };
    }

    if (!device_os || typeof enabled !== 'boolean') {
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

    const { error } = await supabase
      .from('push_subscriptions')
      .update({ enabled, updated_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('device_os', device_os);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    captureException(error, { action: 'updateSubscriptionEnabled', device_os });
    return { success: false, error: 'Failed to update subscription' };
  }
}
