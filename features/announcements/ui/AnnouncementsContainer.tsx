import { AnnouncementList } from './AnnouncementList';
import { Pagination } from '@/components/pagination';
import { AnnouncementsResponse } from '@/supabase';
import { use } from 'react';

export function AnnouncementsContainer({ data }: { data: Promise<AnnouncementsResponse> }) {
  const { announcements, page_size, total_pages } = use(data);

  return (
    <div>
      <AnnouncementList announcements={announcements} />
      {total_pages > 1 && <Pagination currentPage={page_size} totalPages={total_pages} baseUrl="/announcements" />}
    </div>
  );
}
