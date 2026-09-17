import type { Journey, JourneyStats, LearningItem, LearningItemKind, PortfolioContent } from '../lib/content/schema';
import { PageLayout } from '../components/PageLayout';
import { MarkdownContent } from '../components/MarkdownContent';
import { StatList } from '../components/StatList';
import { useSitePath } from '../components/SitePath';

type JourneyPageProps = { journey: Journey } & ({ content: PortfolioContent; items?: never } | { items: LearningItem[]; content?: never });

const sections: { kind: LearningItemKind; id: string; title: string; description: string }[] = [
  { kind: 'topics', id: 'topics', title: 'Topics', description: 'The ideas I’m working through, one connection at a time.' },
  { kind: 'notes', id: 'recent-learning', title: 'Recent learning', description: 'Notes from the process of making things click.' },
];

export function JourneyPage({ journey, content, items }: JourneyPageProps) {
  const link = useSitePath();
  const journeyItems = (items ?? content.learningItems).filter((item) => item.journey === journey.slug);
  const stats = journeyItems.reduce<JourneyStats>((counts, item) => { counts[item.kind] += 1; return counts; }, { topics: 0, notes: 0 });
  return <PageLayout activePath={`/learning/${journey.slug}/`} page="journey">
    <nav className="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href={link('/')}>Home</a></li><li><a href={link('/learning/')}>Learning</a></li><li aria-current="page">{journey.title}</li></ol></nav>
    <header className="page-intro journey-intro"><p className="eyebrow">Learning journey</p><h1>{journey.title}</h1><p className="lede">{journey.description}</p><p className={`status status-${journey.status}`}><span className="status-dot" aria-hidden="true" />{journey.status}</p>{journey.repository && <a className="repository-link" href={journey.repository} target="_blank" rel="noreferrer">View DSA journey on GitHub <span aria-hidden="true">↗</span></a>}</header>
    {journey.currentFocus && <section className="focus-panel" aria-labelledby="current-focus"><h2 id="current-focus">Current focus</h2><p>{journey.currentFocus}</p></section>}
    <StatList stats={stats} />
    {journey.html.trim() && <section className="page-section why-learning" aria-labelledby="why-learning"><div className="section-heading"><p className="eyebrow">The intention</p><h2 id="why-learning">Why I’m learning this</h2></div><MarkdownContent html={journey.html} /></section>}
    {sections.map(({ kind, id, title, description }) => {
      const entries = journeyItems.filter((item) => item.kind === kind).sort((a, b) => (b.date ?? '').localeCompare(a.date ?? '') || a.title.localeCompare(b.title));
      if (entries.length === 0) return null;
      return <section className={`page-section journey-section journey-${kind}`} aria-labelledby={id} key={kind}>
        <div className="section-heading"><div><h2 id={id}>{title}</h2><p>{description}</p></div><span className="section-count">{entries.length}</span></div>
        <ul className={`learning-list ${kind === 'topics' ? 'topic-grid' : 'learning-timeline'}`}>{entries.map((item) => <li key={item.slug}><article className="learning-card">
          <div className="learning-card-meta">{item.date && <time dateTime={item.date}>{item.date}</time>}{item.topic && <span className="tag">{journeyItems.find((topic) => topic.kind === 'topics' && topic.slug === item.topic)?.title}</span>}</div>
          <h3><a href={link(`/learning/${journey.slug}/${item.kind}/${item.slug}/`)}>{item.title} <span aria-hidden="true">↗</span></a></h3><p>{item.description}</p>
        </article></li>)}</ul>
      </section>;
    })}
  </PageLayout>;
}
