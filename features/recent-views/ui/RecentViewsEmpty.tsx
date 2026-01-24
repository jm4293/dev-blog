import { Clock } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';

export function RecentViewsEmpty() {
  return <EmptyState icon={Clock} title="최근 본 글이 없습니다" description="게시글을 읽으면 여기에 표시됩니다." />;
}
