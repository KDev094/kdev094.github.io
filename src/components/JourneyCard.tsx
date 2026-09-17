import type { Journey, JourneyStats } from '../lib/content/schema';
import { StatList } from './StatList';
import { useSitePath } from './SitePath';

export function JourneyCard({ journey, stats }: { journey: Journey; stats?: JourneyStats }) {
  const link = useSitePath();
  return <article className="journey-card">
    <div className="journey-card-art" aria-hidden="true"><span className="journey-node" /><span className="journey-node" /><span className="journey-node" /></div>
    <div className="journey-card-content">
      <p className={`status status-${journey.status}`}><span className="status-dot" aria-hidden="true" />{journey.status}</p>
      <h2><a href={link(`/learning/${journey.slug}/`)}>{journey.title} <span aria-hidden="true">↗</span></a></h2>
      <p>{journey.description}</p>
      {journey.currentFocus && <p className="current-focus"><span>Current focus</span> {journey.currentFocus}</p>}
      {stats && <StatList stats={stats} />}
    </div>
  </article>;
}
