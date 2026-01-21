interface PostCardTagsProps {
  tags: string[];
}

export function PostCardTags({ tags }: PostCardTagsProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {[...tags].sort().map((tag) => (
        <span
          key={tag}
          className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
