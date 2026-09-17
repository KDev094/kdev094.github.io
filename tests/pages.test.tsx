import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeAll, describe, expect, it } from 'vitest';
import { loadPortfolioContent } from '../src/lib/content/load';
import type { PortfolioContent } from '../src/lib/content/schema';
import { createRouteManifest, type StaticRoute } from '../src/lib/routes/manifest';
import { SiteHeader } from '../src/components/SiteHeader';
import { JourneyPage } from '../src/pages/JourneyPage';
import { AppDocument } from '../src/pages/AppDocument';
import { renderRoute } from '../src/pages/renderRoute';

let content: PortfolioContent;
beforeAll(async () => { content = await loadPortfolioContent(path.resolve('src/content')); });

describe('static page presentation', () => {
  it('provides actual section links, current navigation, and an accessible menu control', () => {
    const html = renderToStaticMarkup(<SiteHeader activePath="/learning/dsa/" />);
    for (const [label, href] of [['Home', '/portfolio/'], ['Work', '/portfolio/work/'], ['Projects', '/portfolio/projects/'], ['Learning', '/portfolio/learning/'], ['About', '/portfolio/about/']]) {
      expect(html).toMatch(new RegExp(`<a[^>]*href="${href}"[^>]*>${label}</a>`));
    }
    expect(html).toMatch(/<a[^>]*href="\/portfolio\/learning\/"[^>]*aria-current="location"/);
    expect(html).toMatch(/<button[^>]*aria-expanded="false"[^>]*aria-controls="site-navigation"/);
    expect(html).toContain('id="site-navigation"');
  });

  it('renders the complete journey with derived statistics and navigable learning content', () => {
    const html = renderToStaticMarkup(<JourneyPage journey={content.journeys[0]} content={content} />);
    for (const text of ['Data Structures &amp; Algorithms', 'Graph Algorithms', 'Understanding BFS vs DFS', 'Skip to content']) expect(html).toContain(text);
    expect(html).toContain(content.journeys[0].html);
    expect(html).toContain('<dt>Topics</dt><dd>1</dd>');
    expect(html).toContain('<dt>Notes</dt><dd>1</dd>');
    expect(html).toContain('href="/portfolio/learning/dsa/notes/bfs-vs-dfs/"');
    expect(html).toContain('href="https://github.com/aikev5694/DSA-Journey"');
    expect(html).toContain('View DSA journey on GitHub');
    expect(html).not.toContain('fetch(');
  });

  it('omits absent optional journey sections and focus while deriving zero statistics', () => {
    const journey = { ...content.journeys[0], slug: 'new-journey', title: 'A new journey', currentFocus: undefined, html: '' };
    const html = renderToStaticMarkup(<JourneyPage journey={journey} items={[]} />);
    expect(html).toContain('A new journey');
    expect(html).toContain('<dt>Topics</dt><dd>0</dd>');
    for (const id of ['current-focus', 'why-learning', 'topics', 'recent-learning']) expect(html).not.toContain(`id="${id}"`);
  });

  it('gives every route one main heading, landmarks, and a working skip target', () => {
    const routes: StaticRoute[] = [...createRouteManifest(content), { pathname: '/404.html', pageType: 'not-found', title: 'Page not found | Keval Darji', description: 'Missing page', data: null }];
    for (const route of routes) {
      const html = renderToStaticMarkup(renderRoute(route));
      expect(html.match(/<h1(?:\s|>)/g), route.pathname).toHaveLength(1);
      expect(html.match(/<main(?:\s|>)/g), route.pathname).toHaveLength(1);
      expect(html).toContain('id="main-content"');
      expect(html).toContain('href="#main-content"');
      expect(html).toContain('<header');
      expect(html).toContain('<footer');
    }
  });

  it('shows the same authored project on Work and Projects and links to it from Home', () => {
    const routes = createRouteManifest(content);
    for (const pageType of ['work', 'projects']) {
      const html = renderToStaticMarkup(renderRoute(routes.find((route) => route.pageType === pageType)!));
      expect(html.match(/id="taskflow"/g)).toHaveLength(1);
      expect(html).toContain(content.projects[0].html);
      expect(html).toContain('href="https://github.com/aikev5694/TaskFlow"');
    }
    const home = renderToStaticMarkup(renderRoute(routes[0]));
    expect(home).toContain('href="/portfolio/projects/#taskflow"');
    expect(home).toContain('href="/portfolio/learning/dsa/"');
    expect(home).toContain('<blockquote');
    expect(home).toContain('href="/portfolio/resume.pdf"');
    expect(home).toContain('download="Kev-Resume.pdf"');
  });

  it('offers the résumé download from the About page but not the footer', () => {
    const about = renderToStaticMarkup(renderRoute(createRouteManifest(content).find((route) => route.pageType === 'about')!));
    expect(about.match(/href="\/portfolio\/resume\.pdf"/g)).toHaveLength(1);
    expect(about).toContain('Download résumé');
  });

  it('renders labelled icon links for LinkedIn, GitHub, and email in About and the footer', () => {
    const about = renderToStaticMarkup(renderRoute(createRouteManifest(content).find((route) => route.pageType === 'about')!));
    for (const label of ['LinkedIn', 'GitHub', 'Email']) {
      expect(about.match(new RegExp(`aria-label="${label}"`, 'g'))).toHaveLength(2);
    }
  });

  it('renders an article with authored prose and a back-to-journey anchor', () => {
    const route = createRouteManifest(content).find((route) => route.pathname === '/learning/dsa/notes/bfs-vs-dfs/')!;
    const html = renderToStaticMarkup(renderRoute(route));
    expect(html).toContain('<article');
    expect(html).toContain('<strong>frontier</strong>');
    expect(html).toContain('href="/portfolio/learning/dsa/"');
    expect(html).toContain('Back to Data Structures &amp; Algorithms');
    expect(html).toMatch(/<time[^>]*dateTime="2026-09-10"/);
  });

  it.each(['/', '/preview/site/'])('honors the document base %s throughout its page links', (basePath) => {
    for (const route of createRouteManifest(content)) {
      const html = renderToStaticMarkup(<AppDocument route={route} content={content} siteUrl="https://example.com" basePath={basePath} />);
      const localLinks = [...html.matchAll(/href="(\/[^\"]*)"/g)].map((match) => match[1]);
      expect(localLinks.length).toBeGreaterThan(5);
      for (const href of localLinks) expect(href.startsWith(basePath), `${route.pathname}: ${href}`).toBe(true);
      if (basePath === '/') expect(localLinks.some((href) => href.startsWith('/portfolio/'))).toBe(false);
    }
  });
});
