'use client';

import { AnnouncementCard } from './AnnouncementCard';
import type { Announcement } from '@/supabase';

interface AnnouncementListProps {
  announcements: Announcement[];
  isLoading?: boolean;
}

export function AnnouncementList({ announcements, isLoading }: AnnouncementListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">공지사항이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <AnnouncementCard key={announcement.id} announcement={announcement} />
      ))}
    </div>
  );
}
