'use client';

import { useMemo } from 'react';
import { Bell, BellOff, Monitor, Smartphone, Apple, Trash2 } from 'lucide-react';
import { usePreferencesQuery, useSubscribe, useNotificationPreferences } from '../hooks';
import { useToast } from '@/hooks';
import type { Subscription } from '../types';

// OS별 표시 정보
const OS_META: Record<string, { label: string; Icon: React.ComponentType<{ className?: string }> }> = {
  windows: { label: 'Windows', Icon: Monitor },
  mac: { label: 'Mac', Icon: Apple },
  linux: { label: 'Linux', Icon: Monitor },
  android: { label: 'Android', Icon: Smartphone },
  ios: { label: 'iPhone', Icon: Apple },
};

interface DeviceGroup {
  device_os: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  count: number;
  enabled: boolean; // 그룹 내 모든 기기가 enabled인지
}

// 구독 목록을 OS별로 그룹화
function groupByOS(subscriptions: Subscription[]): DeviceGroup[] {
  const map = new Map<string, Subscription[]>();

  subscriptions.forEach((sub) => {
    const existing = map.get(sub.device_os) || [];
    existing.push(sub);
    map.set(sub.device_os, existing);
  });

  return Array.from(map.entries()).map(([device_os, subs]) => ({
    device_os,
    label: OS_META[device_os]?.label || device_os,
    Icon: OS_META[device_os]?.Icon || Monitor,
    count: subs.length,
    enabled: subs.every((s) => s.enabled),
  }));
}

export function NotificationSettings() {
  const { data, isLoading } = usePreferencesQuery();

  const { toggleAllNotifications, toggleDeviceNotification, deleteDeviceSubscriptions } = useNotificationPreferences();
  const { subscribeMutation } = useSubscribe();
  const { showToast } = useToast();

  const isAllEnabled = data?.preferences?.new_post_enabled ?? false;
  const deviceGroups = useMemo(() => groupByOS(data?.subscriptions || []), [data?.subscriptions]);

  // 구독 요청
  const handleSubscribe = async () => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'denied') {
      showToast({ message: '브라우저에서 알림 권한을 허용해주세요.', type: 'error' });
      return;
    }

    try {
      await subscribeMutation.mutateAsync();
      showToast({ message: '알림 구독이 완료되었습니다.', type: 'success' });
    } catch (error) {
      if (error instanceof Error && error.message.includes('denied')) {
        showToast({ message: '브라우저에서 알림 권한을 허용해주세요.', type: 'error' });
      } else {
        showToast({ message: '알림 구독에 실패했습니다.', type: 'error' });
      }
    }
  };

  // 전체 알림 토글
  const handleToggleAll = () => {
    try {
      toggleAllNotifications.mutate(!isAllEnabled);
    } catch {
      showToast({ message: '알림 설정 변경에 실패했습니다.', type: 'error' });
    }
  };

  // 기기별 토글 (OS 단위)
  const handleToggleDevice = (device_os: string, currentEnabled: boolean) => {
    try {
      toggleDeviceNotification.mutate({ device_os, enabled: !currentEnabled });
    } catch {
      showToast({ message: '기기 알림 설정 변경에 실패했습니다.', type: 'error' });
    }
  };

  // OS 단위 장치 삭제
  const handleDeleteDevice = (device_os: string, label: string) => {
    if (!confirm(`${label} 장치를 삭제할까요?\n삭제하면 해당 장치에서 알림을 받지 못합니다.`)) {
      return;
    }

    try {
      deleteDeviceSubscriptions.mutate(device_os);
      showToast({ message: `${label} 장치가 삭제되었습니다.`, type: 'success' });
    } catch {
      showToast({ message: `${label} 장치 삭제에 실패했습니다.`, type: 'error' });
    }
  };

  if (isLoading) {
    return (
      <>
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />
        <div className="h-10 w-full bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />
      </>
    );
  }

  return (
    <>
      {/* 전체 알림 토글 */}
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          {isAllEnabled ? (
            <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          ) : (
            <BellOff className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          )}
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">새 글 알림</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">새로운 블로그 글이 등록되면 알림을 받습니다.</p>
          </div>
        </div>
        <button
          onClick={handleToggleAll}
          className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
            isAllEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
          }`}
          aria-label="새 글 알림 토글"
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
              isAllEnabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* 장치별 설정 — 전체 토글 ON일 때만 표시 */}
      {isAllEnabled && (
        <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">장치별 설정</p>

          {deviceGroups.length === 0 ? (
            // 등록된 기기가 없는 경우
            <div className="text-center py-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">등록된 장치가 없습니다.</p>
              <button
                onClick={handleSubscribe}
                disabled={subscribeMutation.isPending}
                className={`px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors ${
                  subscribeMutation.isPending
                    ? 'bg-blue-400 dark:bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                }`}
              >
                {subscribeMutation.isPending ? '등록 중...' : '현재 장치 등록'}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {deviceGroups.map((group) => {
                const { Icon } = group;

                return (
                  <div
                    key={group.device_os}
                    className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-gray-50 dark:bg-gray-900/50"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      <span className="text-sm text-gray-900 dark:text-white">{group.label}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">({group.count}기기)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleDevice(group.device_os, group.enabled)}
                        className={`relative w-9 h-5 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:focus:ring-offset-gray-800 ${
                          group.enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                        aria-label={`${group.label} 알림 토글`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                            group.enabled ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                      <button
                        onClick={() => handleDeleteDevice(group.device_os, group.label)}
                        className="p-1 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
                        aria-label={`${group.label} 장치 삭제`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* 현재 장치 추가 버튼 */}
              <button
                // onClick={() => subscribeMutation.mutate()}
                onClick={handleSubscribe}
                disabled={subscribeMutation.isPending}
                className={`mt-2 text-xs transition-colors text-left ${
                  subscribeMutation.isPending
                    ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
                }`}
              >
                {subscribeMutation.isPending ? '등록 중...' : '+ 현재 장치 추가'}
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
