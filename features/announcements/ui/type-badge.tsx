'use client';

import { Bug, Building2, Megaphone, Sparkles, Tag, Wrench } from 'lucide-react';
import type { AnnouncementType } from '@/supabase/types.supabase';
import { ANNOUNCEMENTS } from '@/utils/constants';

interface TypeBadgeProps {
  type: AnnouncementType;
}

const TYPE_ICON: Record<AnnouncementType, typeof Bug> = {
  bug_fix: Bug,
  new_feature: Sparkles,
  new_company: Building2,
  new_tag: Tag,
  update: Megaphone,
  maintenance: Wrench,
};

export function TypeBadge({ type }: TypeBadgeProps) {
  const Icon = TYPE_ICON[type];
  const label = ANNOUNCEMENTS.TYPE_CONFIG[type].label;

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
      <Icon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}
