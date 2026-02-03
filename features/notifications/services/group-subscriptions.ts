import { Monitor, Smartphone, Apple } from 'lucide-react';
import type { Subscription } from '../types';

// OS별 표시 정보
const OS_META: Record<string, { label: string; Icon: React.ComponentType<{ className?: string }> }> = {
  windows: { label: 'Windows', Icon: Monitor },
  mac: { label: 'Mac', Icon: Apple },
  linux: { label: 'Linux', Icon: Monitor },
  android: { label: 'Android', Icon: Smartphone },
  ios: { label: 'iPhone', Icon: Apple },
};

export interface DeviceGroup {
  device_os: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  count: number;
  enabled: boolean;
}

/**
 * 구독 목록을 device_os 기준으로 그룹화 + OS 라벨·아이콘 매핑
 */
export function groupDevices(subscriptions: Subscription[]): DeviceGroup[] {
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
