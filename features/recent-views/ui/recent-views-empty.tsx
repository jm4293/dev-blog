import { BookOpen } from 'lucide-react';
import { EmptyState } from '@/components/ui';

export function RecentViewsEmpty() {
  return <EmptyState icon={BookOpen} title="아직 읽은 글이 없습니다" />;
}
