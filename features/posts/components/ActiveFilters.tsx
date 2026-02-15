interface ActiveFiltersProps {
  searchQuery: string;
  selectedCompanyNamesCount: number;
  selectedTagsCount: number;
  onReset: () => void;
}

export function ActiveFilters({
  searchQuery,
  selectedCompanyNamesCount,
  selectedTagsCount,
  onReset,
}: ActiveFiltersProps) {
  const hasFilters = selectedCompanyNamesCount > 0 || selectedTagsCount > 0 || searchQuery;

  if (!hasFilters) {
    return null;
  }

  return (
    <div className="mt-4 flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-800 dark:bg-blue-900/20">
      <div>
        <p className="text-sm font-semibold text-gray-900 dark:text-white">필터링된 결과</p>
        {searchQuery && (
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
            검색: <span className="font-medium text-blue-600 dark:text-blue-400">{searchQuery}</span>
          </p>
        )}
        {(selectedCompanyNamesCount > 0 || selectedTagsCount > 0) && (
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
            블로그 {selectedCompanyNamesCount}개, 태그 {selectedTagsCount}개 선택됨
          </p>
        )}
      </div>
      <button
        onClick={onReset}
        className="ml-4 whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        초기화
      </button>
    </div>
  );
}
