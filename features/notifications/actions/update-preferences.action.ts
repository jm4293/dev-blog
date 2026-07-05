'use server';

import { headers } from 'next/headers';
import { createSupabaseServerClient } from '@/supabase/server.supabase';
import { checkRateLimit, RATE_LIMIT_CONFIG } from '@/utils/rate-limit';
import type { UpdatePreferencesInput } from '../types';

interface UpdatePreferencesResult {
  success: boolean;
  error?: string;
}

// 회사 140개+, 태그 56개 규모에 맞춰 상향 (모두 선택해도 걸리지 않게)
const MAX_INTERESTS = 300;

function isValidStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.length <= MAX_INTERESTS && value.every((item) => typeof item === 'string');
}

export async function updatePreferencesAction(input: UpdatePreferencesInput): Promise<UpdatePreferencesResult> {
  try {
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';

    if (!checkRateLimit(ip, RATE_LIMIT_CONFIG.AUTHENTICATED)) {
      return { success: false, error: 'Too many requests' };
    }

    // 변경할 필드만 추려서 업데이트 (부분 업데이트 지원)
    const updates: Record<string, boolean | string[] | string> = {};

    if (typeof input.new_post_enabled === 'boolean') {
      updates.new_post_enabled = input.new_post_enabled;
    }
    if (input.subscribed_tags !== undefined) {
      if (!isValidStringArray(input.subscribed_tags)) {
        return { success: false, error: 'Invalid subscribed_tags' };
      }
      updates.subscribed_tags = input.subscribed_tags;
    }
    if (input.subscribed_company_ids !== undefined) {
      if (!isValidStringArray(input.subscribed_company_ids)) {
        return { success: false, error: 'Invalid subscribed_company_ids' };
      }
      updates.subscribed_company_ids = input.subscribed_company_ids;
    }

    if (Object.keys(updates).length === 0) {
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
        ...updates,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    );

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error(error, { action: 'updatePreferences' });
    return { success: false, error: 'Failed to update preferences' };
  }
}
