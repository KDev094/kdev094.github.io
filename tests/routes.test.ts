import path from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeAll, describe, expect, it } from 'vitest';
import { loadPortfolioContent } from '../src/lib/content/load';
import type { PortfolioContent } from '../src/lib/content/schema';
import { createRouteManifest, outputFileFor } from '../src/lib/routes/manifest';
import { AppDocument } from '../src/pages/AppDocument';

let content: PortfolioContent;
beforeAll(async () => {
  content = await loadPortfolioContent(path.resolve('tests/fixtures/valid'));
});

describe('static route manifest', () => {
  it('includes every public section, journey, and normalized learning item once', () => {
    const routes = createRouteManifest(content);
    expect(routes.map((route) => route.pathname)).toEqual(expect.arrayContaining([
      '/', '/work/', '/projects/', '/learning/', '/about/', '/learning/dsa/',
      '/learning/dsa/topics/graphs/', '/learning/dsa/notes/bfs-vs-dfs/',
    ]));
    expect(routes).toHaveLength(8);
    expect(new Set(routes.map((route) => route.pathname)).size).toBe(routes.length);
  });

  it('derives learning page metadata and typed data from content', () => {
    const route = createRouteManifest(content).find(({ pathname }) => pathname === '/learning/dsa/notes/bfs-vs-dfs/');
    expect(route?.title).toBe('Understanding BFS vs DFS | Data Structures & Algorithms Learning Journey');
    expect(route?.description).toBe(content.learningItems.find(({ slug }) => slug === 'bfs-vs-dfs')?.description);
    expect(route?.pageType).toBe('learning-item');
    if (route?.pageType === 'learning-item') {
      expect(route.data.item.kind).toBe('notes');
      expect(route.data.journey.slug).toBe('dsa');
    }
  });

  it.each([
    ['/', 'index.html'],
    ['/learning/dsa/notes/bfs-vs-dfs/', 'learning/dsa/notes/bfs-vs-dfs/index.html'],
  ])('maps %s to a physical directory entry', (pathname, output) => {
    expect(outputFileFor(pathname)).toBe(output);
  });

  it.each(['/../secret/', '//work/', '/work', '/work/?query=x', '/work/./'])('rejects unsafe or noncanonical path %s', (pathname) => {
    expect(() => outputFileFor(pathname)).toThrow();
  });
});

describe('static document', () => {
  it('renders content, base-safe links, and social metadata without client rendering', () => {
    const route = createRouteManifest(content).find(({ pathname }) => pathname === '/learning/dsa/notes/bfs-vs-dfs/')!;
    const html = renderToStaticMarkup(createElement(AppDocument, {
      route, content, siteUrl: 'https://portfolio.example', basePath: '/portfolio/',
      assets: { stylesheets: ['/portfolio/assets/main-abc.css'], scripts: ['/portfolio/assets/main-def.js'] },
    }));
    expect(html).toContain('<html lang="en"');
    expect(html).toContain('name="viewport"');
    expect(html).toContain('<title>Understanding BFS vs DFS | Data Structures &amp; Algorithms Learning Journey</title>');
    expect(html).toContain('rel="canonical" href="https://portfolio.example/portfolio/learning/dsa/notes/bfs-vs-dfs/"');
    expect(html).toContain('property="og:url" content="https://portfolio.example/portfolio/learning/dsa/notes/bfs-vs-dfs/"');
    expect(html).toContain('name="twitter:card" content="summary"');
    expect(html).toContain('href="/portfolio/learning/"');
    expect(html).toContain('href="/portfolio/assets/main-abc.css"');
    expect(html).toContain('src="/portfolio/assets/main-def.js"');
    expect(html).toContain(route.pageType === 'learning-item' ? route.data.item.html : 'missing content');
  });
});
