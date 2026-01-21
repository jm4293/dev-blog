import { X } from 'lucide-react';

interface SelectedBadgesProps {
  selectedCompanyNames: string[];
  selectedTags: string[];
  onCompanyRemove: (companyName: string) => void;
  onTagRemove: (tag: string) => void;
}

export function SelectedBadges({
  selectedCompanyNames,
  selectedTags,
  onCompanyRemove,
  onTagRemove,
}: SelectedBadgesProps) {
  const hasSelection = selectedCompanyNames.length > 0 || selectedTags.length > 0;

  if (!hasSelection) return null;

  return (
    <div className="mt-4 space-y-2">
      {/* Selected Companies */}
      {selectedCompanyNames.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            선택된 기업 ({selectedCompanyNames.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {[...selectedCompanyNames].sort().map((companyName) => (
              <span
                key={companyName}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
              >
                {companyName}
                <button
                  onClick={() => onCompanyRemove(companyName)}
                  className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors"
                  aria-label={`Remove ${companyName} company`}
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">선택된 태그 ({selectedTags.length})</p>
          <div className="flex flex-wrap gap-2">
            {[...selectedTags].sort().map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
              >
                {tag}
                <button
                  onClick={() => onTagRemove(tag)}
                  className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors"
                  aria-label={`Remove ${tag} tag`}
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
