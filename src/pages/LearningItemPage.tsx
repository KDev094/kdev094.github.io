import type { Journey, LearningItem } from '../lib/content/schema';
import { PageLayout } from '../components/PageLayout';
import { MarkdownContent } from '../components/MarkdownContent';
import { useSitePath } from '../components/SitePath';

const kindLabels = { topics: 'Topic', notes: 'Learning note' };

export function LearningItemPage({ journey, item }: { journey: Journey; item: LearningItem }) {
  const link = useSitePath();
  const journeyPath = `/learning/${journey.slug}/`;
  return <PageLayout activePath={`${journeyPath}${item.kind}/${item.slug}/`} page="learning-item">
    <nav className="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href={link('/learning/')}>Learning</a></li><li><a href={link(journeyPath)}>{journey.title}</a></li><li aria-current="page">{item.title}</li></ol></nav>
    <article className="learning-article">
      <header className="page-intro article-intro"><p className="eyebrow">{kindLabels[item.kind]}</p><h1>{item.title}</h1><p className="lede">{item.description}</p><div className="article-meta">{item.date && <time className="article-date" dateTime={item.date}>{item.date}</time>}{item.referenceUrl && <a href={item.referenceUrl} target="_blank" rel="noreferrer">View source note <span aria-hidden="true">↗</span></a>}</div></header>
      <MarkdownContent html={item.html} />
      <footer className="article-footer"><a href={link(journeyPath)}><span aria-hidden="true">← </span>Back to {journey.title}</a></footer>
    </article>
  </PageLayout>;
}
