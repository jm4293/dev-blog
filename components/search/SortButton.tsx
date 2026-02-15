'use client';

interface SortButtonProps {
  currentSort: 'newest' | 'oldest';
  onSortChange: (sort: 'newest' | 'oldest') => void;
}

export function SortButton({ currentSort, onSortChange }: SortButtonProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(e.target.value as 'newest' | 'oldest');
  };

  return (
    <select
      value={currentSort}
      onChange={handleChange}
      className="cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white bg-right bg-no-repeat px-3 py-3 font-medium text-gray-900 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 md:px-4"
      style={{
        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
        backgroundSize: '20px',
        paddingRight: '2.5rem',
      }}
    >
      <option value="newest">최신 순</option>
      <option value="oldest">오래된 순</option>
    </select>
  );
}
