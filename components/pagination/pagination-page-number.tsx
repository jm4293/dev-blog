import Link from 'next/link';

interface PaginationPageNumberProps {
  pageNum: number;
  isCurrentPage: boolean;
  url?: string;
  onClick?: (page: number) => void;
}

export function PaginationPageNumber({ pageNum, isCurrentPage, url, onClick }: PaginationPageNumberProps) {
  const styles = `px-4 py-2 rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 ${
    isCurrentPage ? 'bg-foreground text-background' : 'glass-card text-foreground hover:bg-muted/60'
  }`;
  const ariaCurrent = isCurrentPage ? ('page' as const) : undefined;
  const ariaLabel = `${pageNum}페이지`;

  if (onClick) {
    return (
      <button onClick={() => onClick(pageNum)} className={styles} aria-current={ariaCurrent} aria-label={ariaLabel}>
        {pageNum}
      </button>
    );
  }

  if (url) {
    return (
      <Link href={url} className={styles} aria-current={ariaCurrent} aria-label={ariaLabel}>
        {pageNum}
      </Link>
    );
  }

  return null;
}
