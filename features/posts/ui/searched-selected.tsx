import { X } from 'lucide-react';

interface SearchedSelectedProps {
  selectedBlogs: string[];
  selectedTags: string[];
  onBlogRemove: (blogName: string) => void;
  onTagRemove: (tag: string) => void;
}

export function SearchedSelected({ selectedBlogs, selectedTags, onBlogRemove, onTagRemove }: SearchedSelectedProps) {
  const hasSelection = selectedBlogs.length > 0 || selectedTags.length > 0;

  if (!hasSelection) {
    return null;
  }

  return (
    <div className="mt-4 space-y-2">
      {/* 블로그 */}
      {selectedBlogs.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">선택된 블로그 ({selectedBlogs.length})</p>
          <div className="flex flex-wrap gap-2">
            {[...selectedBlogs].sort().map((blog) => (
              <span
                key={blog}
                className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-medium text-foreground"
              >
                {blog}
                <button
                  onClick={() => onBlogRemove(blog)}
                  className="rounded-full p-0.5 transition-colors hover:bg-muted-foreground/20"
                  aria-label={`Remove ${blog} blog`}
                >
                  <X className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 태그 */}
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
