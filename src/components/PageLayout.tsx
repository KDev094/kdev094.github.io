import type { ReactNode } from 'react';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';

export function PageLayout({ activePath, page, children }: { activePath: string; page: string; children: ReactNode }) {
  return <div className={`page page-${page}`} data-surface={page === 'learning' ? 'dark' : undefined}>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <SiteHeader activePath={activePath} />
    <main className="page-content" id="main-content" tabIndex={-1}>{children}</main>
    <SiteFooter />
  </div>;
}
