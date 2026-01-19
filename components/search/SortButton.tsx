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
      className="px-3 md:px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer appearance-none bg-no-repeat bg-right"
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
