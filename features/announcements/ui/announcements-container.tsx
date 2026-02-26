import { AnnouncementList } from './announcement-list';
import { Pagination } from '@/components/pagination';
import { AnnouncementsResponse } from '@/supabase/types.supabase';
import { use } from 'react';

export function AnnouncementsContainer({ data }: { data: Promise<AnnouncementsResponse> }) {
  const { announcements, page, total_pages } = use(data);

  return (
    <>
      <AnnouncementList announcements={announcements} />
      {total_pages > 1 && <Pagination currentPage={page} totalPages={total_pages} baseUrl="/announcements" />}
    </>
  );
}
