import type { PortfolioContent } from '../lib/content/schema';
import { PageLayout } from '../components/PageLayout';

export function WorkPage({ content }: { content: PortfolioContent }) {
  return <PageLayout activePath="/work/" page="work">
    <header className="page-intro"><p className="eyebrow">Professional journey</p><h1>Work shaped by care.</h1><p className="lede">A timeline of roles, responsibilities, and the steady practice of building useful software.</p></header>
    <section className="page-section role-timeline" aria-labelledby="timeline-title"><h2 id="timeline-title">Roles &amp; responsibilities</h2>{content.roles.map((role) => <article className="role-entry" key={role.slug}><div className="role-period"><time>{role.started}</time><span>—</span><time>{role.current ? 'Present' : role.ended}</time></div><div className="role-content"><p className="eyebrow">{role.company}{role.current && <span className="status status-active">Current</span>}</p><h3>{role.title}</h3><p>{role.summary}</p><ul>{role.responsibilities.map((responsibility) => <li key={responsibility}>{responsibility}</li>)}</ul></div></article>)}</section>
  </PageLayout>;
}
