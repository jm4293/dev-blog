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
      ? 'bg-foreground text-background'
      : 'bg-background text-foreground border border-border hover:bg-muted'
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
