'use client';

import { ANNOUNCEMENTS } from '@/utils/constants';
import type { AnnouncementType } from '@/supabase/types.supabase';

interface TypeBadgeProps {
  type: AnnouncementType;
}

export function TypeBadge({ type }: TypeBadgeProps) {
  const config = ANNOUNCEMENTS.TYPE_CONFIG[type];

  return (
    <span
      className={`
        inline-flex items-center gap-2 px-3 py-1 rounded-full
        text-sm font-semibold
        ${config.bgColor}
        ${config.textColor}
      `}
    >
      <span>{config.emoji}</span>
      <span>{config.label}</span>
    </span>
  );
}
