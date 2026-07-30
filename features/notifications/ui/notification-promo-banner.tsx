'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getLocalStorage, setLocalStorage } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { Bell, X } from 'lucide-react';
import { useUser } from '@/features/auth';
import { queryKeys } from '@/lib/query-keys';
import type { PreferencesResponse } from '../types';

const DISMISS_KEY = 'notification-promo-dismissed';

/**
 * 새 글 알림 유도 배너 (/posts 상단)
 *
 * 알림 기능의 진입점이 프로필 하단뿐이라 존재 자체를 모르는 사용자가 많다.
 * 로그인했지만 아직 알림을 켜지 않은 사용자에게만 보여주고, 닫으면 다시 표시하지 않는다.
 * 비로그인/닫은 사용자에게는 설정 조회 요청도 보내지 않는다 (enabled 게이트).
 */
export function NotificationPromoBanner() {
  const [dismissed, setDismissed] = useState(() => getLocalStorage(DISMISS_KEY, false));
  const { data: user } = useUser();

  const { data } = useQuery<PreferencesResponse>({
    queryKey: queryKeys.notifications.preferences(),
    queryFn: async () => {
      const response = await fetch('/api/notifications/preferences');
      if (!response.ok) {
        throw new Error('Failed to fetch preferences');
      }
      return response.json();
    },
    enabled: !dismissed && !!user,
    staleTime: 5 * 60 * 1000,
  });

  const needsSetup = data != null && (!data.preferences.new_post_enabled || data.subscriptions.length === 0);

  if (dismissed || !user || !needsSetup) {
    return null;
  }

  const handleDismiss = () => {
    setLocalStorage(DISMISS_KEY, true);
    setDismissed(true);
  };

  return (
    <div className="mb-6 flex items-center gap-3 rounded-xl border border-border bg-card p-4">
      <Bell className="h-5 w-5 shrink-0 text-foreground" aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">새 글 알림 받아보세요</p>
        <p className="text-xs text-muted-foreground">관심 태그·회사의 새 글이 올라오면 푸시로 알려드려요.</p>
      </div>
      <Link
        href="/profile"
        className="shrink-0 rounded-lg bg-foreground px-3 py-1.5 text-sm font-semibold text-background transition-opacity hover:opacity-90"
      >
        설정하기
      </Link>
      <button
        onClick={handleDismiss}
        aria-label="알림 안내 닫기"
        className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
