import { PageLayout } from '../components/PageLayout';
import { useSitePath } from '../components/SitePath';

export function NotFoundPage() {
  const link = useSitePath();
  return <PageLayout activePath="/404.html" page="not-found"><section className="page-intro not-found-intro"><p className="eyebrow">404 — A small detour</p><h1>Page not found.</h1><p className="lede">The page you’re looking for may have moved, or the link may be incomplete.</p><a className="button button-primary" href={link('/')}>Return home <span aria-hidden="true">→</span></a></section></PageLayout>;
}
