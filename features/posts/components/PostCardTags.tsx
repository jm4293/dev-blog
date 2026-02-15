interface PostCardTagsProps {
  tags: string[];
}

export function PostCardTags({ tags }: PostCardTagsProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {[...tags].sort().map((tag) => (
        <span
          key={tag}
          className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
