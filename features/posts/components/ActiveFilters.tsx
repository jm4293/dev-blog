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
    <div className="mt-4 flex items-center justify-between rounded-lg border border-border bg-muted/50 px-4 py-3">
      <div>
        <p className="text-sm font-semibold text-foreground">필터링된 결과</p>
        {searchQuery && (
          <p className="mt-1 text-xs text-muted-foreground">
            검색: <span className="font-medium text-foreground">{searchQuery}</span>
          </p>
        )}
        {(selectedCompanyNamesCount > 0 || selectedTagsCount > 0) && (
          <p className="mt-1 text-xs text-muted-foreground">
            블로그 {selectedCompanyNamesCount}개, 태그 {selectedTagsCount}개 선택됨
          </p>
        )}
      </div>
      <button
        onClick={onReset}
        className="ml-4 whitespace-nowrap rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-foreground/90"
      >
        초기화
      </button>
    </div>
  );
}
