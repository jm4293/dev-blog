import Link from 'next/link';
import { formatPostDate, slugify } from '@/utils';
import { Bookmark, Eye } from 'lucide-react';
import { BlogLogoImage } from '@/components/image';
import type { WeeklyDigest } from '../services/fetch-digest';

interface DigestContentProps {
  digest: WeeklyDigest;
}

/**
 * 주간 인기글 본문 (서버 컴포넌트)
 * 인기 글 순위 + 회사/태그 통계
 */
export function DigestContent({ digest }: DigestContentProps) {
  return (
    <div className="flex flex-col gap-10">
      {/* 인기 글 순위 */}
      <section aria-label="주간 인기 글 순위">
        <h2 className="mb-4 text-lg font-bold text-foreground md:text-xl">인기 글 TOP {digest.topPosts.length}</h2>
        <ol className="flex flex-col gap-3">
          {digest.topPosts.map((post, index) => (
            <li key={post.id}>
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="w-7 shrink-0 pt-0.5 text-center text-lg font-bold text-muted-foreground">
                  {index + 1}
                </span>
                <BlogLogoImage logoUrl={post.company.logo_url} companyName={post.company.name} width={36} height={36} />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 font-semibold text-foreground">{post.title}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span>{post.company.name}</span>
                    <span>{formatPostDate(post.published_at)}</span>
                    {post.bookmark_count > 0 && (
                      <span className="inline-flex items-center gap-1">
                        <Bookmark className="h-3 w-3" aria-hidden />
                        {post.bookmark_count}
                      </span>
                    )}
                    {post.view_count > 0 && (
                      <span className="inline-flex items-center gap-1">
                        <Eye className="h-3 w-3" aria-hidden />
                        {post.view_count}
                      </span>
                    )}
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ol>
      </section>

      {/* 주간 통계 */}
      <section aria-label="주간 통계" className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-3 text-base font-semibold text-foreground">활발했던 회사</h2>
          {digest.companyStats.length === 0 ? (
            <p className="text-sm text-muted-foreground">데이터가 없습니다.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {digest.companyStats.map((stat) => (
                <li key={stat.name} className="flex items-center justify-between text-sm">
                  {stat.slug ? (
                    <Link
                      href={`/companies/${stat.slug}`}
                      className="text-foreground transition-colors hover:underline"
                    >
                      {stat.name}
                    </Link>
                  ) : (
                    <span className="text-foreground">{stat.name}</span>
                  )}
                  <span className="text-muted-foreground">{stat.count}개</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-3 text-base font-semibold text-foreground">인기 태그</h2>
          {digest.tagStats.length === 0 ? (
            <p className="text-sm text-muted-foreground">데이터가 없습니다.</p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {digest.tagStats.map((stat) => (
                <li key={stat.name}>
                  <Link
                    href={`/tags/${slugify(stat.name)}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1.5 text-xs text-foreground transition-colors hover:bg-muted"
                  >
                    {stat.name}
                    <span className="text-muted-foreground">{stat.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
