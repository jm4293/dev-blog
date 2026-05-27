import { Clock } from 'lucide-react';
import { EmptyState } from '@/components/ui';

export function RecentViewsEmpty() {
  return <EmptyState icon={Clock} title="최근 본 글이 없습니다" />;
}
