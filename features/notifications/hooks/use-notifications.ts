'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { PreferencesResponse } from '../types';

export function useNotifications() {
  return useQuery<PreferencesResponse>({
    queryKey: queryKeys.notifications.preferences(),
    queryFn: async () => {
      const response = await fetch('/api/notifications/preferences');

      if (!response.ok) {
        throw new Error('Failed to fetch preferences');
      }

      return response.json();
    },
  });
}
