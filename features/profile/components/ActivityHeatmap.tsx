import { fetchBookmarkStats } from '../services';
import { ActivityHeatmapClient } from './ActivityHeatmapClient';

interface ActivityHeatmapProps {
  year?: number;
}

export async function ActivityHeatmap({ year }: ActivityHeatmapProps) {
  const selectedYear = year || new Date().getFullYear();
  const stats = await fetchBookmarkStats(selectedYear);

  return <ActivityHeatmapClient stats={stats} selectedYear={selectedYear} />;
}
