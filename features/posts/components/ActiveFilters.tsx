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
    <div className="mt-4 flex items-center justify-between px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
      <div>
        <p className="text-sm font-semibold text-gray-900 dark:text-white">필터링된 결과</p>
        {searchQuery && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            검색: <span className="font-medium text-blue-600 dark:text-blue-400">{searchQuery}</span>
          </p>
        )}
        {(selectedCompanyNamesCount > 0 || selectedTagsCount > 0) && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            블로그 {selectedCompanyNamesCount}개, 태그 {selectedTagsCount}개 선택됨
          </p>
        )}
      </div>
      <button
        onClick={onReset}
        className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors whitespace-nowrap ml-4"
      >
        초기화
      </button>
    </div>
  );
}
