import type { PortfolioContent } from '../lib/content/schema';
import { PageLayout } from '../components/PageLayout';
import { JourneyCard } from '../components/JourneyCard';

export function LearningPage({ content }: { content: PortfolioContent }) {
  return <PageLayout activePath="/learning/" page="learning">
    <header className="page-intro learning-intro"><p className="eyebrow">Curiosity, given a direction</p><h1>Always a work<br />in progress.</h1><p className="lede">A living record of what I’m learning — the questions, the experiments, and the understanding that grows along the way.</p><p className="intro-note">Learning deliberately. Connecting the dots.</p></header>
    <section className="page-section" aria-labelledby="journeys"><div className="section-heading"><div><p className="eyebrow">One topic at a time</p><h2 id="journeys">Learning journeys</h2></div><span className="section-count">{content.journeys.length} {content.journeys.length === 1 ? 'journey' : 'journeys'}</span></div>
      <div className="journey-grid">{content.journeys.map((journey) => <JourneyCard key={journey.slug} journey={journey} stats={content.getJourneyStats(journey.slug)} />)}</div>
    </section>
    <aside className="learning-note"><p>Not everything needs to become a project. Sometimes the most useful outcome is a better question.</p></aside>
  </PageLayout>;
}
