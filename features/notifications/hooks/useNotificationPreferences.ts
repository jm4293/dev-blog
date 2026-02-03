'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { removeSubscriptionByOSAction, updateSubscriptionEnabledAction, updatePreferencesAction } from '../actions';
import type { PreferencesResponse } from '../types';

/**
 * 알림 설정 조회/변경 훅
 */
export function useNotificationPreferences() {
  const queryClient = useQueryClient();

  // 전체 알림 on/off 변경 — 낙관적 업데이트
  const toggleAllNotifications = useMutation({
    mutationFn: async (new_post_enabled: boolean) => {
      const result = await updatePreferencesAction(new_post_enabled);
      if (!result.success) {
        throw new Error(result.error);
      }
    },
    onMutate: async (new_post_enabled) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications.preferences() });
      const previous = queryClient.getQueryData<PreferencesResponse>(queryKeys.notifications.preferences());

      queryClient.setQueryData<PreferencesResponse>(queryKeys.notifications.preferences(), (old) => {
        if (!old) {
          return old;
        }

        return {
          ...old,
          preferences: { ...old.preferences, new_post_enabled },
        };
      });

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.notifications.preferences(), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.preferences() });
    },
  });

  // 기기별 enabled 변경 (OS 단위 bulk) — 낙관적 업데이트
  const toggleDeviceNotification = useMutation({
    mutationFn: async ({ device_os, enabled }: { device_os: string; enabled: boolean }) => {
      const result = await updateSubscriptionEnabledAction(device_os, enabled);

      if (!result.success) {
        throw new Error(result.error);
      }
    },
    onMutate: async ({ device_os, enabled }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications.preferences() });
      const previous = queryClient.getQueryData<PreferencesResponse>(queryKeys.notifications.preferences());

      queryClient.setQueryData<PreferencesResponse>(queryKeys.notifications.preferences(), (old) => {
        if (!old) return old;
        return {
          ...old,
          subscriptions: old.subscriptions.map((sub) => (sub.device_os === device_os ? { ...sub, enabled } : sub)),
        };
      });

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.notifications.preferences(), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.preferences() });
    },
  });

  // OS 단위 장치 삭제
  const deleteDeviceSubscriptions = useMutation({
    mutationFn: async (device_os: string) => await removeSubscriptionByOSAction(device_os),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.preferences() });
    },
  });

  return {
    toggleAllNotifications,
    toggleDeviceNotification,
    deleteDeviceSubscriptions,
  };
}
