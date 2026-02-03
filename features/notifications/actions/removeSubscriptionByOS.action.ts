'use server';

import { createSupabaseServerClient } from '@/supabase/server.supabase';
import { checkRateLimit, RATE_LIMIT_CONFIG } from '@/utils/rate-limit';
import { captureException } from '@/sentry.config';
import { headers } from 'next/headers';

interface RemoveSubscriptionByOSResult {
  success: boolean;
  error?: string;
}

export async function removeSubscriptionByOSAction(device_os: string): Promise<RemoveSubscriptionByOSResult> {
  try {
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip, RATE_LIMIT_CONFIG.AUTHENTICATED)) {
      return { success: false, error: 'Too many requests' };
    }

    if (!device_os) {
      return { success: false, error: 'Missing device_os' };
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
      .delete()
      .eq('user_id', user.id)
      .eq('device_os', device_os);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    captureException(error, { action: 'removeSubscriptionByOS', device_os });
    return { success: false, error: 'Failed to remove subscriptions' };
  }
}
