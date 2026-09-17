import type { ReactNode } from 'react';
import type { PortfolioContent } from '../lib/content/schema';
import type { StaticRoute } from '../lib/routes/manifest';
import { siteBase } from '../lib/routes/paths';
import { SiteBaseContext } from '../components/SitePath';
import { PageLayout } from '../components/PageLayout';
import { renderRoute } from './renderRoute';

export interface DocumentAssets {
  stylesheets: string[];
  scripts: string[];
}

export interface AppDocumentProps {
  route: StaticRoute;
  content: PortfolioContent;
  siteUrl: string;
  basePath?: string;
  assets?: DocumentAssets;
  children?: ReactNode;
}

/** Server-rendered document shell. Page components may replace the default body via children. */
export function AppDocument({ route, siteUrl, basePath, assets, children }: AppDocumentProps) {
  const canonical = new URL(siteBase(route.pathname, basePath), siteUrl).href;
  return <html lang="en"><head>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{route.title}</title>
    <meta name="description" content={route.description} />
    <link rel="canonical" href={canonical} />
    <meta property="og:type" content={route.pageType === 'learning-item' ? 'article' : 'website'} />
    <meta property="og:title" content={route.title} />
    <meta property="og:description" content={route.description} />
    <meta property="og:url" content={canonical} />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content={route.title} />
    <meta name="twitter:description" content={route.description} />
    {route.pageType === 'not-found' && <meta name="robots" content="noindex" />}
    {assets?.stylesheets.map((href) => <link key={href} rel="stylesheet" href={href} />)}
  </head><body>
    <SiteBaseContext.Provider value={basePath}>{children == null ? renderRoute(route) : <PageLayout activePath={route.pathname} page={route.pageType}>{children}</PageLayout>}</SiteBaseContext.Provider>
    {assets?.scripts.map((src) => <script key={src} type="module" src={src} />)}
  </body></html>;
}
