import { use } from 'react';
import { Pagination } from '@/components/pagination';
import { AnnouncementsResponse } from '@/supabase/types.supabase';
import { AnnouncementList } from './announcement-list';

export function AnnouncementsContainer({ data }: { data: Promise<AnnouncementsResponse> }) {
  const { announcements, page, total_pages } = use(data);

  return (
    <>
      <AnnouncementList announcements={announcements} />
      {total_pages > 1 && <Pagination currentPage={page} totalPages={total_pages} baseUrl="/announcements" />}
    </>
  );
}
