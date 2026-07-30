import Link from 'next/link';

interface PostCardTagsProps {
  tags: string[];
  /** false면 링크 없이 표시만 (최근 본 글 편집 모드 등 클릭이 다른 동작과 겹칠 때) */
  linked?: boolean;
}

export function PostCardTags({ tags, linked = true }: PostCardTagsProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    // 카드 전체를 덮는 원본 링크 오버레이 위에서 클릭되도록 z-10
    <div className="relative z-10 mb-4 flex flex-wrap gap-2">
      {[...tags].sort().map((tag) =>
        linked ? (
          <Link
            key={tag}
            href={`/posts?tags=${encodeURIComponent(tag)}`}
            title={`${tag} 태그 글 모아보기`}
            className="inline-block rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
          >
            {tag}
          </Link>
        ) : (
          <span
            key={tag}
            className="inline-block rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
          >
            {tag}
          </span>
        ),
      )}
    </div>
  );
}
