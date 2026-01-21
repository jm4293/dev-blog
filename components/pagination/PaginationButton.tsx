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
      return `${baseStyles} px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600`;
    }

    if (isDisabled) {
      return `${baseStyles} p-2 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed`;
    }

    return `${baseStyles} p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700`;
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
