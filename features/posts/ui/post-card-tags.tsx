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
          className="inline-block rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
