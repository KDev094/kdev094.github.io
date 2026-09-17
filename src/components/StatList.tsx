import type { JourneyStats } from '../lib/content/schema';

export function StatList({ stats }: { stats: JourneyStats }) {
  return <dl className="stat-list" aria-label="Journey statistics">
    <div><dt>Topics</dt><dd>{stats.topics}</dd></div>
    <div><dt>Notes</dt><dd>{stats.notes}</dd></div>
  </dl>;
}
