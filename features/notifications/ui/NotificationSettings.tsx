'use client';

import { Bell, BellOff, Trash2 } from 'lucide-react';
import { useNotifications, useNotificationSubscribe, useNotificationPreferences } from '../hooks';
import { groupDevices } from '../services';
import { useToast } from '@/hooks';

export function NotificationSettings() {
  const { data, isLoading } = useNotifications();
  const { toggleAllNotifications, toggleDeviceNotification, deleteDeviceSubscriptions } = useNotificationPreferences();
  const { subscribeMutation } = useNotificationSubscribe();
  const { showToast } = useToast();

  const isAllEnabled = data?.preferences.new_post_enabled;
  const deviceGroups = groupDevices(data?.subscriptions || []);

  const handleToggleAll = () => {
    try {
      toggleAllNotifications.mutate(!isAllEnabled);
    } catch {
      showToast({ message: '알림 설정 변경에 실패했습니다.', type: 'error' });
    }
  };

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

  const handleToggleDevice = (device_os: string, currentEnabled: boolean) => {
    try {
      toggleDeviceNotification.mutate({ device_os, enabled: !currentEnabled });
    } catch {
      showToast({ message: '기기 알림 설정 변경에 실패했습니다.', type: 'error' });
    }
  };

  const handleDeleteDevice = (device_os: string, label: string) => {
    if (!confirm(`${label} 장치를 삭제할까요?\n삭제하면 해당 장치에서 알림을 받지 못합니다.`)) return;
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
        <div className="mb-4 h-4 w-24 animate-pulse rounded bg-muted" />
        <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
      </>
    );
  }

  return (
    <>
      {/* 전체 알림 토글 */}
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          {isAllEnabled ? (
            <Bell className="h-5 w-5 text-foreground" />
          ) : (
            <BellOff className="h-5 w-5 text-muted-foreground" />
          )}
          <div>
            <p className="text-sm font-medium text-foreground">새 글 알림</p>
            <p className="text-xs text-muted-foreground">새로운 블로그 글이 등록되면 알림을 받습니다.</p>
          </div>
        </div>
        <button
          onClick={handleToggleAll}
          className={`relative h-6 w-11 rounded-full transition-colors duration-200 focus:ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 ${
            isAllEnabled ? 'bg-foreground' : 'bg-border'
          }`}
          aria-label="새 글 알림 토글"
        >
          <span
            className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-background shadow transition-transform duration-200 ${
              isAllEnabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* 장치별 설정 */}
      {isAllEnabled && (
        <div className="border-t border-border pt-3">
          <p className="mb-3 text-xs font-medium text-muted-foreground">장치별 설정</p>

          {deviceGroups.length === 0 ? (
            <div className="py-4 text-center">
              <p className="mb-3 text-sm text-muted-foreground">등록된 장치가 없습니다.</p>
              <button
                onClick={handleSubscribe}
                disabled={subscribeMutation.isPending}
                className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-50"
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
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/50 px-3 py-2.5"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-foreground" />
                      <span className="text-sm text-foreground">{group.label}</span>
                      <span className="text-xs text-muted-foreground">({group.count}기기)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleDevice(group.device_os, group.enabled)}
                        className={`relative h-5 w-9 rounded-full transition-colors duration-200 focus:ring-offset-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 ${
                          group.enabled ? 'bg-foreground' : 'bg-border'
                        }`}
                        aria-label={`${group.label} 알림 토글`}
                      >
                        <span
                          className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-background shadow transition-transform duration-200 ${
                            group.enabled ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                      <button
                        onClick={() => handleDeleteDevice(group.device_os, group.label)}
                        className="p-1 text-muted-foreground transition-colors hover:text-destructive"
                        aria-label={`${group.label} 장치 삭제`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              <button
                onClick={handleSubscribe}
                disabled={subscribeMutation.isPending}
                className="mt-2 text-left text-xs text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
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
