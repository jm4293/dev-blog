'use client';

import { useState } from 'react';
import { useAnnouncements } from '../hooks/useAnnouncements';
import { AnnouncementList } from './AnnouncementList';
import { Pagination } from '@/components/pagination';

export function AnnouncementsContainer() {
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useAnnouncements({
    page,
  });

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 dark:text-red-400">공지사항을 불러오는 중 오류가 발생했습니다.</p>
      </div>
    );
  }

  return (
    <div>
      <AnnouncementList announcements={data?.announcements || []} isLoading={isLoading} />
      {(data?.total_pages || 0) > 1 && (
        <Pagination
          currentPage={page}
          totalPages={data?.total_pages || 1}
          baseUrl="/announcements"
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
