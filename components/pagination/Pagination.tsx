'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/useIsMobile';

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
    const params = new URLSearchParams();
    if (page > 1) params.set('page', page.toString());
    if (searchQuery) params.set('search', encodeURIComponent(searchQuery));
    if (tagsString) params.set('tags', tagsString);

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
        {onPageChange ? (
          <button
            onClick={() => handlePageClick(1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg border border-gray-300 dark:border-gray-600 font-semibold transition-colors ${
              currentPage === 1
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <ChevronsLeft className="w-5 h-5" />
          </button>
        ) : (
          <Link
            href={`${baseUrl}?page=1`}
            className={`p-2 rounded-lg border border-gray-300 dark:border-gray-600 font-semibold transition-colors ${
              currentPage === 1
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            onClick={(e) => {
              if (currentPage === 1) {
                e.preventDefault();
              }
            }}
          >
            <ChevronsLeft className="w-5 h-5" />
          </Link>
        )}

        {/* 이전 */}
        {onPageChange ? (
          <button
            onClick={() => prevPage && handlePageClick(prevPage)}
            disabled={!prevPage}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        ) : prevPage ? (
          <Link
            href={buildUrl(prevPage)}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
        ) : (
          <button
            disabled
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-600 cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* 페이지 번호 */}
        {pageNumbers.map((pageNum) => {
          const isCurrentPage = pageNum === currentPage;

          return onPageChange ? (
            <button
              key={pageNum}
              onClick={() => handlePageClick(pageNum)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                isCurrentPage
                  ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {pageNum}
            </button>
          ) : (
            <Link
              key={pageNum}
              href={buildUrl(pageNum)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                isCurrentPage
                  ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {pageNum}
            </Link>
          );
        })}

        {/* 다음 */}
        {onPageChange ? (
          <button
            onClick={() => nextPage && handlePageClick(nextPage)}
            disabled={!nextPage}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        ) : nextPage ? (
          <Link
            href={buildUrl(nextPage)}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </Link>
        ) : (
          <button
            disabled
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-600 cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* 마지막 */}
        {onPageChange ? (
          <button
            onClick={() => handlePageClick(totalPages)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg border border-gray-300 dark:border-gray-600 font-semibold transition-colors ${
              currentPage === totalPages
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <ChevronsRight className="w-5 h-5" />
          </button>
        ) : (
          <Link
            href={`${baseUrl}?page=${totalPages}`}
            className={`p-2 rounded-lg border border-gray-300 dark:border-gray-600 font-semibold transition-colors ${
              currentPage === totalPages
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            onClick={(e) => {
              if (currentPage === totalPages) {
                e.preventDefault();
              }
            }}
          >
            <ChevronsRight className="w-5 h-5" />
          </Link>
        )}
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
