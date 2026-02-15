import { AnnouncementCard } from './AnnouncementCard';
import type { Announcement } from '@/supabase';

interface AnnouncementListProps {
  announcements: Announcement[];
}

export function AnnouncementList({ announcements }: AnnouncementListProps) {
  if (announcements.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-gray-500 dark:text-gray-400">공지사항이 없습니다.</p>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      {announcements.map((announcement) => (
        <AnnouncementCard key={announcement.id} announcement={announcement} />
      ))}
    </section>
  );
}
