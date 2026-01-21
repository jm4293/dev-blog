interface NoPostsMessageProps {
  searchQuery: string;
  selectedTagsLength: number;
  selectedCompaniesLength: number;
}

export function NoPostsMessage({ searchQuery, selectedTagsLength, selectedCompaniesLength }: NoPostsMessageProps) {
  const hasFilters = searchQuery || selectedTagsLength > 0 || selectedCompaniesLength > 0;

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-900 dark:text-white">게시글이 없습니다</p>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {hasFilters ? '검색 조건을 변경해주세요' : '새로운 게시글이 곧 추가될 예정입니다'}
        </p>
      </div>
    </div>
  );
}
