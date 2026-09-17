import { useSitePath } from './SitePath';

const navigation = [
  ['Home', '/'], ['Work', '/work/'], ['Projects', '/projects/'],
  ['Learning', '/learning/'], ['About', '/about/'],
] as const;

export function SiteHeader({ activePath }: { activePath: string }) {
  const link = useSitePath();
  return <header className="site-header">
    <a className="site-brand" href={link('/')} aria-label="Kev. — home">Keval Darji<span>.</span></a>
    <div className="header-controls">
      <button className="theme-toggle" type="button" data-theme-toggle hidden aria-label="Switch color theme"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a6 6 0 1 0 6 6 7 7 0 1 1-6-6Z" /></svg></button>
      <button className="menu-toggle" type="button" data-menu-toggle hidden aria-expanded="false" aria-controls="site-navigation">Menu</button>
    </div>
    <nav className="site-navigation" id="site-navigation" aria-label="Main navigation">
      {navigation.map(([label, pathname]) => {
        const current = activePath === pathname ? 'page' : pathname !== '/' && activePath.startsWith(pathname) ? 'location' : undefined;
        return <a key={pathname} href={link(pathname)} aria-current={current}>{label}</a>;
      })}
    </nav>
  </header>;
}
