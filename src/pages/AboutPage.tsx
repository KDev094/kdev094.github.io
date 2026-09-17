import { PageLayout } from '../components/PageLayout';
import { useSitePath } from '../components/SitePath';
import { SocialLinks } from '../components/SocialLinks';

export function AboutPage() {
  const link = useSitePath();
  return <PageLayout activePath="/about/" page="about">
    <header className="page-intro"><p className="eyebrow">The person behind the work</p><h1>Curious by nature.<br />A builder by practice.</h1><p className="lede">I’m Keval, a developer who enjoys turning complicated ideas into thoughtful, useful software.</p></header>
    <section className="page-section about-story" aria-labelledby="about-story"><h2 id="about-story">A little about me</h2><div className="prose"><p>I’m drawn to the details that make things work: a clear model, a well-chosen abstraction, an interface that helps someone find their next step.</p><p>Building and learning feed each other. Projects give me questions worth studying; deliberate practice gives me better ways to approach the next project.</p><p>This space documents the work I care about and the understanding I’m still developing.</p></div></section>
    <div className="about-links"><a className="button button-primary" href={link('/work/')}>See my work <span aria-hidden="true">↗</span></a><a className="text-link" href={link('/learning/')}>Explore my learning journeys <span aria-hidden="true">→</span></a><a className="button" href={link('/resume.pdf')} download="Keval-Darji-Resume.pdf">Download résumé <span aria-hidden="true">↓</span></a></div>
    <SocialLinks />
  </PageLayout>;
}
