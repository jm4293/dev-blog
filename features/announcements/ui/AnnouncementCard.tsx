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
    <article className="glass-card transform rounded-lg p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="mb-4 flex items-center justify-between gap-3">
        <TypeBadge type={announcement.type} />
        <time className="whitespace-nowrap text-sm font-medium text-muted-foreground">{timeDisplay}</time>
      </div>

      <h2 className="mb-3 text-lg font-bold text-foreground">{announcement.title}</h2>

      <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{announcement.content}</p>
    </article>
  );
}
