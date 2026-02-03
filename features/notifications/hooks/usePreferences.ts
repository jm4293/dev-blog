'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { PreferencesResponse } from '../types';

async function fetchPreferences(): Promise<PreferencesResponse> {
  const response = await fetch('/api/notifications/preferences');

  if (!response.ok) throw new Error('Failed to fetch preferences');
  return response.json();
}

export function usePreferencesQuery() {
  return useQuery({
    queryKey: queryKeys.notifications.preferences(),
    queryFn: fetchPreferences,
  });
}
