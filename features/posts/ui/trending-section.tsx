import { TrendingUp } from 'lucide-react';
import type { PostWithCompany } from '@/supabase/types.supabase';
import { PostList } from './post-list';

interface TrendingSectionProps {
  posts: PostWithCompany[];
}

/**
 * 이번 주 인기 글 섹션 (서버 컴포넌트)
 * 북마크 수/조회수 기반으로 선정된 글을 보여준다.
 */
export function TrendingSection({ posts }: TrendingSectionProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section aria-label="이번 주 인기 글" className="mb-8 border-b border-border pb-8">
      <div className="mb-1 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-foreground" aria-hidden />
        <h2 className="text-lg font-bold text-foreground md:text-xl">이번 주 인기 글</h2>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">최근 일주일간 북마크와 조회가 많았던 글이에요.</p>
      <PostList posts={posts} />
    </section>
  );
}
