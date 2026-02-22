import { fetchBookmarkStats } from '../services';
import { ActivityHeatmapClient } from './ActivityHeatmapClient';

interface ActivityHeatmapProps {
  year?: number;
}

export async function ActivityHeatmap({ year }: ActivityHeatmapProps) {
  const selectedYear = year || new Date().getFullYear();
  const stats = await fetchBookmarkStats(selectedYear);

  return (
    <div className="mb-6 overflow-visible rounded-xl border border-border bg-card p-6">
      <ActivityHeatmapClient stats={stats} selectedYear={selectedYear} />
    </div>
  );
}
