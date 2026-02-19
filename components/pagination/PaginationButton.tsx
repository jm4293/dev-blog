import Link from 'next/link';

interface PaginationButtonProps {
  page: number | null;
  isDisabled: boolean;
  isActive?: boolean;
  url?: string;
  onClick?: (page: number) => void;
  children: React.ReactNode;
  className?: string;
}

export function PaginationButton({
  page,
  isDisabled,
  isActive = false,
  url,
  onClick,
  children,
  className = '',
}: PaginationButtonProps) {
  const baseStyles = 'rounded-lg font-semibold transition-colors';

  const getStyles = () => {
    if (isActive) {
      return `${baseStyles} px-4 py-2 bg-foreground text-background`;
    }

    if (isDisabled) {
      return `${baseStyles} p-2 border border-border bg-muted text-muted-foreground cursor-not-allowed`;
    }

    return `${baseStyles} p-2 border border-border bg-background text-foreground hover:bg-muted`;
  };

  const styles = `${getStyles()} ${className}`;

  // onClick 핸들러가 있으면 button
  if (onClick && page) {
    return (
      <button onClick={() => onClick(page)} disabled={isDisabled} className={styles}>
        {children}
      </button>
    );
  }

  // URL이 있고 disabled가 아니면 Link
  if (url && !isDisabled) {
    return (
      <Link href={url} className={styles}>
        {children}
      </Link>
    );
  }

  // disabled 상태면 button
  return (
    <button disabled className={styles}>
      {children}
    </button>
  );
}
