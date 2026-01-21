'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/useIsMobile';
import { buildQueryParams } from '@/utils';
import { PaginationButton } from './PaginationButton';
import { PaginationPageNumber } from './PaginationPageNumber';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount?: number;
  baseUrl: string;
  onPageChange?: (page: number) => void;
  searchQuery?: string;
  tagsString?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  totalCount = 0,
  baseUrl,
  onPageChange,
  searchQuery,
  tagsString,
}: PaginationProps) {
  const isMobile = useIsMobile();

  // URL에 쿼리 파라미터 추가
  const buildUrl = (page: number) => {
    const params = buildQueryParams({
      page: page > 1 ? page : undefined,
      search: searchQuery,
      tags: tagsString,
    });

    return params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
  };

  // 페이지 클릭 핸들러
  const handlePageClick = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  // 페이지 번호 범위 계산 (반응형)
  const getPageNumbers = () => {
    const pageCount = isMobile ? 3 : 5; // 모바일 3개, 데스크탑 5개
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
    <div className="flex flex-col items-center gap-6 mt-12">
      {/* 페이지네이션 네비게이션 */}
      <nav className="flex justify-center items-center gap-2">
        {/* 처음 */}
        <PaginationButton
          page={1}
          isDisabled={currentPage === 1}
          url={onPageChange ? undefined : buildUrl(1)}
          onClick={onPageChange ? handlePageClick : undefined}
        >
          <ChevronsLeft className="w-5 h-5" />
        </PaginationButton>

        {/* 이전 */}
        <PaginationButton
          page={prevPage}
          isDisabled={!prevPage}
          url={onPageChange || !prevPage ? undefined : buildUrl(prevPage)}
          onClick={onPageChange ? handlePageClick : undefined}
        >
          <ChevronLeft className="w-5 h-5" />
        </PaginationButton>

        {/* 페이지 번호 */}
        {pageNumbers.map((pageNum) => (
          <PaginationPageNumber
            key={pageNum}
            pageNum={pageNum}
            isCurrentPage={pageNum === currentPage}
            url={onPageChange ? undefined : buildUrl(pageNum)}
            onClick={onPageChange ? handlePageClick : undefined}
          />
        ))}

        {/* 다음 */}
        <PaginationButton
          page={nextPage}
          isDisabled={!nextPage}
          url={onPageChange || !nextPage ? undefined : buildUrl(nextPage)}
          onClick={onPageChange ? handlePageClick : undefined}
        >
          <ChevronRight className="w-5 h-5" />
        </PaginationButton>

        {/* 마지막 */}
        <PaginationButton
          page={totalPages}
          isDisabled={currentPage === totalPages}
          url={onPageChange ? undefined : buildUrl(totalPages)}
          onClick={onPageChange ? handlePageClick : undefined}
        >
          <ChevronsRight className="w-5 h-5" />
        </PaginationButton>
      </nav>

      {/* 페이지 정보 표시 */}
      {totalPages > 0 && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          페이지 {currentPage} / {totalPages} {totalCount > 0 && `(총 ${totalCount}개)`}
        </p>
      )}
    </div>
  );
}
