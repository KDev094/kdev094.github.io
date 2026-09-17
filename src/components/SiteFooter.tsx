import { useSitePath } from './SitePath';
import { SocialLinks } from './SocialLinks';

export function SiteFooter() {
  const link = useSitePath();
  return <footer className="site-footer">
    <a className="site-brand" href={link('/')} aria-label="Kev. — home">Keval Darji<span>.</span></a>
    <p>Building thoughtfully. Learning deliberately.</p>
    <SocialLinks />
    <a href={link('/about/')}>A little about me <span aria-hidden="true">↗</span></a>
  </footer>;
}
