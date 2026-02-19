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

  if (!hasSelection) {
    return null;
  }

  return (
    <div className="mt-4 space-y-2">
      {/* Selected Companies */}
      {selectedCompanyNames.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">선택된 블로그 ({selectedCompanyNames.length})</p>
          <div className="flex flex-wrap gap-2">
            {[...selectedCompanyNames].sort().map((companyName) => (
              <span
                key={companyName}
                className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-medium text-foreground"
              >
                {companyName}
                <button
                  onClick={() => onCompanyRemove(companyName)}
                  className="rounded-full p-0.5 transition-colors hover:bg-muted-foreground/20"
                  aria-label={`Remove ${companyName} company`}
                >
                  <X className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">선택된 태그 ({selectedTags.length})</p>
          <div className="flex flex-wrap gap-2">
            {[...selectedTags].sort().map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-medium text-foreground"
              >
                {tag}
                <button
                  onClick={() => onTagRemove(tag)}
                  className="rounded-full p-0.5 transition-colors hover:bg-muted-foreground/20"
                  aria-label={`Remove ${tag} tag`}
                >
                  <X className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
