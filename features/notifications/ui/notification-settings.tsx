'use client';

import { useState } from 'react';
import { usePwaInstall, useToast } from '@/hooks';
import { Bell, BellOff, PlusSquare, Share, Trash2 } from 'lucide-react';
import { ConfirmModal } from '@/components/modal';
import { useNotificationPreferences, useNotifications, useNotificationSubscribe } from '../hooks';
import { detectDevice, groupDevices } from '../services';
import { NotificationInterests } from './notification-interests';

export function NotificationSettings() {
  const { data, isLoading } = useNotifications();
  const { toggleAllNotifications, toggleDeviceNotification, deleteDeviceSubscriptions } = useNotificationPreferences();
  const { subscribeMutation } = useNotificationSubscribe();
  const { showToast } = useToast();
  const { isStandalone, canInstall, promptInstall } = usePwaInstall();

  const isAllEnabled = data?.preferences.new_post_enabled;
  const deviceGroups = groupDevices(data?.subscriptions || []);

  // iOS Safari는 홈 화면에 추가(PWA 설치)해야만 푸시를 지원한다 —
  // 구독을 시도해 실패한 뒤에야 알게 하지 말고 사전에 안내한다
  // (SSR 시점엔 navigator가 없지만, 이 값을 쓰는 UI는 클라이언트 조회 완료 후에만 렌더됨)
  const needsIOSInstall = typeof navigator !== 'undefined' && detectDevice().device_os === 'ios' && !isStandalone;

  const handleSubscribe = async () => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'denied') {
      // 이미 거부한 상태에서는 requestPermission이 다시 묻지 않으므로 해제 경로를 안내
      showToast({
        message: '알림 권한이 차단되어 있습니다. 주소창의 자물쇠(사이트 설정) → 알림에서 허용으로 변경해주세요.',
        type: 'error',
        duration: 5000,
      });
      return;
    }
    try {
      await subscribeMutation.mutateAsync();
      showToast({ message: '알림 구독이 완료되었습니다.', type: 'success' });
    } catch (error) {
      // 훅에서 사용자 안내용 한국어 메시지를 던짐 (권한 거부, iOS 미설치 안내 등)
      const message = error instanceof Error && error.message ? error.message : '알림 구독에 실패했습니다.';
      showToast({ message, type: 'error' });
    }
  };

  const handleToggleAll = async () => {
    const enabling = !isAllEnabled;

    try {
      await toggleAllNotifications.mutateAsync(enabling);
    } catch {
      showToast({ message: '알림 설정 변경에 실패했습니다.', type: 'error' });
      return;
    }

    // 토글만 켜면 알림이 오지 않는다 — 등록된 장치가 없으면 현재 기기 등록(권한 요청)까지 이어서 진행
    // (실패해도 토글은 켜진 상태로 남고, 아래 "현재 장치 등록" 버튼으로 재시도할 수 있다)
    // iOS 미설치 상태에서는 구독이 반드시 실패하므로 시도하지 않는다 (설치 안내 박스가 대신 표시됨)
    if (enabling && deviceGroups.length === 0 && !needsIOSInstall) {
      await handleSubscribe();
    }
  };

  const handleInstall = async () => {
    const accepted = await promptInstall();
    if (accepted) {
      showToast({ message: '앱 설치가 시작되었습니다.', type: 'success' });
    }
  };

  const handleToggleDevice = async (device_os: string, currentEnabled: boolean) => {
    try {
      await toggleDeviceNotification.mutateAsync({ device_os, enabled: !currentEnabled });
    } catch {
      showToast({ message: '기기 알림 설정 변경에 실패했습니다.', type: 'error' });
    }
  };

  // 삭제 확인 모달 대상 장치
  const [deleteTarget, setDeleteTarget] = useState<{ device_os: string; label: string } | null>(null);

  const handleConfirmDeleteDevice = async () => {
    if (!deleteTarget) return;
    const { device_os, label } = deleteTarget;
    try {
      await deleteDeviceSubscriptions.mutateAsync(device_os);
      showToast({ message: `${label} 장치가 삭제되었습니다.`, type: 'success' });
    } catch {
      showToast({ message: `${label} 장치 삭제에 실패했습니다.`, type: 'error' });
    } finally {
      setDeleteTarget(null);
    }
  };

  if (isLoading) {
    return (
      <div className="mb-6 rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">알림 설정</h3>
        <div className="mb-4 h-4 w-24 animate-pulse rounded bg-muted" />
        <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 text-lg font-semibold text-foreground">알림 설정</h3>
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
          role="switch"
          aria-checked={isAllEnabled}
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

      {/* 관심사 설정 (관심 태그/회사만 알림) */}
      {isAllEnabled && data && <NotificationInterests preferences={data.preferences} />}

      {/* 장치별 설정 */}
      {isAllEnabled && (
        <div className="mt-3 border-t border-border pt-3">
          <p className="mb-3 text-xs font-medium text-muted-foreground">장치별 설정</p>

          {needsIOSInstall && (
            <div className="mb-3 rounded-lg border border-border bg-muted/50 p-3">
              <p className="text-sm font-medium text-foreground">iOS는 홈 화면에 추가한 뒤 알림을 받을 수 있어요</p>
              <ol className="mt-2 space-y-1 text-xs text-muted-foreground">
                <li className="flex items-center gap-1.5">
                  1. Safari 하단의 공유 버튼 <Share className="h-3.5 w-3.5" aria-label="공유" /> 을 누르세요
                </li>
                <li className="flex items-center gap-1.5">
                  2. <PlusSquare className="h-3.5 w-3.5" aria-hidden /> &quot;홈 화면에 추가&quot;를 선택하세요
                </li>
                <li>3. 추가된 devBlog.kr 앱을 열어 이 화면에서 장치를 등록하세요</li>
              </ol>
            </div>
          )}

          {deviceGroups.length === 0 ? (
            <div className="py-4 text-center">
              <p className="mb-3 text-sm text-muted-foreground">등록된 장치가 없습니다.</p>
              {!needsIOSInstall && (
                <button
                  onClick={handleSubscribe}
                  disabled={subscribeMutation.isPending}
                  className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {subscribeMutation.isPending ? '등록 중...' : '현재 장치 등록'}
                </button>
              )}
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
                        role="switch"
                        aria-checked={group.enabled}
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
                        onClick={() => setDeleteTarget({ device_os: group.device_os, label: group.label })}
                        className="p-1 text-muted-foreground transition-colors hover:text-destructive"
                        aria-label={`${group.label} 장치 삭제`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {!needsIOSInstall && (
                <button
                  onClick={handleSubscribe}
                  disabled={subscribeMutation.isPending}
                  className="mt-2 text-left text-xs text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {subscribeMutation.isPending ? '등록 중...' : '+ 현재 장치 추가'}
                </button>
              )}
            </div>
          )}

          {/* Chrome 계열에서 설치 프롬프트가 가능하면 앱 설치 유도 (설치하면 홈 화면에서 바로 진입) */}
          {canInstall && (
            <button
              onClick={handleInstall}
              className="mt-3 text-left text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              + devBlog.kr 앱으로 설치하기 — 홈 화면에서 바로 열 수 있어요
            </button>
          )}
        </div>
      )}

      <ConfirmModal
        open={deleteTarget !== null}
        title="장치 삭제"
        description={`${deleteTarget?.label ?? ''} 장치를 삭제할까요? 삭제하면 해당 장치에서 알림을 받지 못합니다.`}
        confirmLabel="삭제"
        destructive
        icon={Trash2}
        isPending={deleteDeviceSubscriptions.isPending}
        pendingLabel="삭제 중..."
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        onConfirm={handleConfirmDeleteDevice}
      />
    </div>
  );
}
