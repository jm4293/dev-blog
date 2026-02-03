'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { usePushSubscription } from './usePushSubscription';

export function useSubscribe() {
  const queryClient = useQueryClient();
  const { subscribe } = usePushSubscription();

  const subscribeMutation = useMutation({
    mutationFn: subscribe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.preferences() });
    },
  });

  return {
    subscribeMutation,
  };
}
