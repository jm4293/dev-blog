'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  onPageChange?: (page: number) => void;
  searchQuery?: string;
  tagsString?: string;
}

export const Pagination = ({
  currentPage,
  totalPages,
  baseUrl,
  onPageChange,
  searchQuery,
  tagsString,
}: PaginationProps) => {
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

  // 페이지 번호 범위 계산 (현재 페이지 기준 ±2)
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    // 첫 페이지
    rangeWithDots.push(1);

    // 점 추가
    if (range[0] > 2) {
      rangeWithDots.push('...');
    }

    // 범위 페이지
    rangeWithDots.push(...range);

    // 점 추가
    if (range[range.length - 1] < totalPages - 1) {
      rangeWithDots.push('...');
    }

    // 마지막 페이지
    if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const pageNumbers = getPageNumbers();
  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  return (
    <nav className="flex justify-center items-center gap-2 mt-12">
      {/* 처음 */}
      {onPageChange ? (
        <button
          onClick={() => handlePageClick(1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 font-semibold transition-colors ${
            currentPage === 1
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}>
          처음
        </button>
      ) : (
        <Link
          href={`${baseUrl}?page=1`}
          className={`px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 font-semibold transition-colors ${
            currentPage === 1
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
          onClick={(e) => {
            if (currentPage === 1) {
              e.preventDefault();
            }
          }}>
          처음
        </Link>
      )}

      {/* 이전 */}
      {onPageChange ? (
        <button
          onClick={() => prevPage && handlePageClick(prevPage)}
          disabled={!prevPage}
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed">
          <ChevronLeft className="w-5 h-5" />
        </button>
      ) : prevPage ? (
        <Link
          href={buildUrl(prevPage)}
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
      ) : (
        <button
          disabled
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-600 cursor-not-allowed">
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* 페이지 번호 */}
      {pageNumbers.map((pageNum, index) => {
        if (pageNum === '...') {
          return (
            <span key={`dots-${index}`} className="px-3 py-2 text-gray-500 dark:text-gray-400">
              ...
            </span>
          );
        }

        const isCurrentPage = pageNum === currentPage;

        return onPageChange ? (
          <button
            key={pageNum}
            onClick={() => handlePageClick(pageNum as number)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              isCurrentPage
                ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}>
            {pageNum}
          </button>
        ) : (
          <Link
            key={pageNum}
            href={buildUrl(pageNum as number)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              isCurrentPage
                ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}>
            {pageNum}
          </Link>
        );
      })}

      {/* 다음 */}
      {onPageChange ? (
        <button
          onClick={() => nextPage && handlePageClick(nextPage)}
          disabled={!nextPage}
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed">
          <ChevronRight className="w-5 h-5" />
        </button>
      ) : nextPage ? (
        <Link
          href={buildUrl(nextPage)}
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <ChevronRight className="w-5 h-5" />
        </Link>
      ) : (
        <button
          disabled
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-600 cursor-not-allowed">
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* 마지막 */}
      {onPageChange ? (
        <button
          onClick={() => handlePageClick(totalPages)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 font-semibold transition-colors ${
            currentPage === totalPages
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}>
          마지막
        </button>
      ) : (
        <Link
          href={`${baseUrl}?page=${totalPages}`}
          className={`px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 font-semibold transition-colors ${
            currentPage === totalPages
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
          onClick={(e) => {
            if (currentPage === totalPages) {
              e.preventDefault();
            }
          }}>
          마지막
        </Link>
      )}
    </nav>
  );
};
