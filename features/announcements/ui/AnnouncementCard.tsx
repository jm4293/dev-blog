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
    <article className="transform rounded-lg border border-gray-200 bg-white p-6 transition-shadow duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:shadow-xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <TypeBadge type={announcement.type} />
        <time className="whitespace-nowrap text-sm font-medium text-gray-500 dark:text-gray-400">{timeDisplay}</time>
      </div>

      <h2 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">{announcement.title}</h2>

      <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        {announcement.content}
      </p>
    </article>
  );
}
