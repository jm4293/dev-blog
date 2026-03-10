'use client';

import { buildQueryParams } from '@/utils';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { PaginationButton } from './pagination-button';
import { PaginationPageNumber } from './pagination-page-number';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount?: number;
  baseUrl: string;
  onPageChange?: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, totalCount = 0, baseUrl, onPageChange }: PaginationProps) {
  const isMobile = useIsMobile();

  const buildUrl = (page: number) => {
    const params = buildQueryParams({
      page: page > 1 ? page : undefined,
    });

    return params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
  };

  const getPageNumbers = () => {
    const pageCount = isMobile ? 3 : 5;
    const range = [];

    // 현재 페이지가 속한 묶음의 시작 페이지
    let startPage = Math.floor((currentPage - 1) / pageCount) * pageCount + 1;
    let endPage = Math.min(startPage + pageCount - 1, totalPages);

    for (let i = startPage; i <= endPage; i++) {
      range.push(i);
    }

    return range;
  };

  const pageNumbers = getPageNumbers();

  // 묶음으로 이동 (모바일 3개, 데스크탑 5개)
  const pageCount = isMobile ? 3 : 5;
  const firstPageInRange = pageNumbers[0];
  const lastPageInRange = pageNumbers[pageNumbers.length - 1];

  // 이전 범위의 첫 번째 페이지
  const prevPage = firstPageInRange > 1 ? Math.max(1, firstPageInRange - pageCount) : null;
  // 다음 범위의 첫 번째 페이지
  const nextPage = lastPageInRange < totalPages ? lastPageInRange + 1 : null;

  return (
    <div className="mt-12 flex flex-col items-center gap-6">
      <nav className="flex items-center justify-center gap-2">
        <PaginationButton
          page={1}
          isDisabled={currentPage === 1}
          url={onPageChange ? undefined : buildUrl(1)}
          onClick={onPageChange}
          ariaLabel="첫 페이지로 이동"
        >
          <ChevronsLeft className="h-5 w-5" />
        </PaginationButton>

        <PaginationButton
          page={prevPage}
          isDisabled={!prevPage}
          url={onPageChange || !prevPage ? undefined : buildUrl(prevPage)}
          onClick={onPageChange}
          ariaLabel="이전 페이지 묶음으로 이동"
        >
          <ChevronLeft className="h-5 w-5" />
        </PaginationButton>

        {pageNumbers.map((pageNum) => (
          <PaginationPageNumber
            key={pageNum}
            pageNum={pageNum}
            isCurrentPage={pageNum === currentPage}
            url={onPageChange ? undefined : buildUrl(pageNum)}
            onClick={onPageChange}
          />
        ))}

        <PaginationButton
          page={nextPage}
          isDisabled={!nextPage}
          url={onPageChange || !nextPage ? undefined : buildUrl(nextPage)}
          onClick={onPageChange}
          ariaLabel="다음 페이지 묶음으로 이동"
        >
          <ChevronRight className="h-5 w-5" />
        </PaginationButton>

        <PaginationButton
          page={totalPages}
          isDisabled={currentPage === totalPages}
          url={onPageChange ? undefined : buildUrl(totalPages)}
          onClick={onPageChange}
          ariaLabel="마지막 페이지로 이동"
        >
          <ChevronsRight className="h-5 w-5" />
        </PaginationButton>
      </nav>

      {totalPages > 0 && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          페이지 {currentPage} / {totalPages} {totalCount > 0 && `(총 ${totalCount}개)`}
        </p>
      )}
    </div>
  );
}
