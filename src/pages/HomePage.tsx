import type { PortfolioContent } from '../lib/content/schema';
import { PageLayout } from '../components/PageLayout';
import { ProjectCard } from '../components/ProjectCard';
import { JourneyCard } from '../components/JourneyCard';
import { useSitePath } from '../components/SitePath';

export function HomePage({ content }: { content: PortfolioContent }) {
  const link = useSitePath();
  const currentRole = content.roles.find((role) => role.current);
  const featuredProjects = content.projects.filter((project) => project.featured).slice(0, 2);
  const featuredJourneys = content.journeys.filter((journey) => journey.featured).slice(0, 2);
  return <PageLayout activePath="/" page="home">
    <section className="home-hero" aria-labelledby="home-title">
      <div className="hero-copy"><p className="eyebrow">Developer &amp; lifelong learner</p>
        <h1 id="home-title">Hi, I’m Keval<span className="accent">.</span><br />I build with curiosity<br />and intention.</h1>
        <p className="lede">Thoughtful software, meaningful projects, and a little more understanding every day.</p>
        <div className="hero-actions"><a className="button button-primary" href={link('/work/')}>Explore my work <span aria-hidden="true">↗</span></a><a className="text-link" href={link('/learning/')}>Follow my learning <span aria-hidden="true">→</span></a><a className="button" href={link('/resume.pdf')} download="Keval-Darji-Resume.pdf">Download résumé <span aria-hidden="true">↓</span></a></div>
      </div>
      <div className="mountain-scene" aria-hidden="true"><div className="mountain-sun" /><div className="mountain mountain-back" /><div className="mountain mountain-middle" /><div className="mountain mountain-front" /><span className="landscape-caption">Always exploring.</span></div>
    </section>
    <section className="page-section" aria-labelledby="selected-work"><div className="section-heading"><div><p className="eyebrow">From idea to implementation</p><h2 id="selected-work">Selected work</h2></div><a href={link('/projects/')}>All projects <span aria-hidden="true">→</span></a></div>
      {currentRole && <article className="current-role-panel"><div><p className="eyebrow">Current role</p><h3>{currentRole.title}</h3><p className="current-role-company">{currentRole.company} <span aria-hidden="true">·</span> {currentRole.started}–Present</p><p>{currentRole.summary}</p></div></article>}
      <div className="project-grid">{featuredProjects.map((project) => <ProjectCard key={project.slug} project={project} />)}</div>
    </section>
    <section className="page-section home-learning" aria-labelledby="learning-heading"><div className="section-heading"><div><p className="eyebrow">A practice, not a finish line</p><h2 id="learning-heading">Learning in the open</h2></div><a href={link('/learning/')}>All journeys <span aria-hidden="true">→</span></a></div>
      <div className="journey-grid">{featuredJourneys.map((journey) => <JourneyCard key={journey.slug} journey={journey} />)}</div>
    </section>
    <aside className="reflection-block"><p className="eyebrow">A thought to carry forward</p><blockquote>Small steps, taken with intention, become a way forward.</blockquote><p>A reminder to keep building, asking questions, and making room to learn.</p></aside>
  </PageLayout>;
}
