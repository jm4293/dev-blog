'use client';

import { ANNOUNCEMENTS } from '@/utils/constants';
import { cn } from '@/utils';
import type { AnnouncementType } from '@/supabase/types.supabase';

interface TypeBadgeProps {
  type: AnnouncementType;
}

export function TypeBadge({ type }: TypeBadgeProps) {
  const config = ANNOUNCEMENTS.TYPE_CONFIG[type];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold',
        config.bgColor,
        config.textColor,
      )}
    >
      <span>{config.emoji}</span>
      <span>{config.label}</span>
    </span>
  );
}
