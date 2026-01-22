'use client';

import { format } from 'date-fns';
import { TypeBadge } from './TypeBadge';
import type { Announcement } from '@/supabase';

interface AnnouncementCardProps {
  announcement: Announcement;
}

export function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  const createdDate = new Date(announcement.created_at);
  const timeDisplay = format(createdDate, 'yyyy-MM-dd');

  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg dark:hover:shadow-xl transition-shadow hover:-translate-y-1 transform duration-300">
      <div className="flex items-center justify-between mb-4 gap-3">
        <TypeBadge type={announcement.type} />
        <time className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap font-medium">{timeDisplay}</time>
      </div>

      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{announcement.title}</h2>

      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">
        {announcement.content}
      </p>
    </article>
  );
}
