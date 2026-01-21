import Link from 'next/link';

interface PaginationPageNumberProps {
  pageNum: number;
  isCurrentPage: boolean;
  url?: string;
  onClick?: (page: number) => void;
}

export function PaginationPageNumber({ pageNum, isCurrentPage, url, onClick }: PaginationPageNumberProps) {
  const styles = `px-4 py-2 rounded-lg font-semibold transition-colors ${
    isCurrentPage
      ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
  }`;

  if (onClick) {
    return (
      <button onClick={() => onClick(pageNum)} className={styles}>
        {pageNum}
      </button>
    );
  }

  if (url) {
    return (
      <Link href={url} className={styles}>
        {pageNum}
      </Link>
    );
  }

  return null;
}
