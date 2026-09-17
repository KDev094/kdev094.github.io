import { access, lstat, mkdir, readFile, readdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadPortfolioContent } from '../src/lib/content/load';
import { createRouteManifest, outputFileFor, type StaticRoute } from '../src/lib/routes/manifest';
import { normalizeBasePath, siteBase } from '../src/lib/routes/paths';
import { AppDocument, type DocumentAssets } from '../src/pages/AppDocument';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputRoot = path.resolve(repositoryRoot, 'dist');
if (path.dirname(outputRoot) !== repositoryRoot || (await lstat(outputRoot)).isSymbolicLink()) {
  throw new Error('Static output must be the repository dist directory, not a symlink.');
}

// Vite already copied/bundled assets into dist. Retain their exact filenames.
const viteHtml = await readFile(path.join(outputRoot, 'index.html'), 'utf8');
const assets: DocumentAssets = {
  stylesheets: [...viteHtml.matchAll(/<link\b(?=[^>]*\brel="stylesheet")[^>]*\bhref="([^"]+)"[^>]*>/g)].map((match) => match[1]),
  scripts: [...viteHtml.matchAll(/<script\b[^>]*\bsrc="([^"]+)"[^>]*>/g)].map((match) => match[1]),
};
if (!assets.scripts.length || !assets.stylesheets.length) throw new Error('Vite output is missing its client script or stylesheet. Run vite build before rendering.');

async function clearOldPages(directory: string): Promise<void> {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name === 'assets') continue;
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) await clearOldPages(target);
    else if (entry.isFile() && entry.name.endsWith('.html')) await unlink(target);
  }
}

const content = await loadPortfolioContent(path.join(repositoryRoot, 'src/content'));
const routes = createRouteManifest(content);
const basePath = normalizeBasePath(process.env.BASE_PATH ?? '/');
const siteUrl = process.env.SITE_URL ?? 'https://example.com';
// Validate URL before changing previous pages.
new URL(siteUrl);
await clearOldPages(outputRoot);

async function writePage(route: StaticRoute, relativeOutput = outputFileFor(route.pathname)): Promise<void> {
  const target = path.join(outputRoot, relativeOutput);
  await mkdir(path.dirname(target), { recursive: true });
  const markup = renderToStaticMarkup(createElement(AppDocument, { route, content, siteUrl, basePath, assets }));
  await writeFile(target, `<!doctype html>\n${markup}\n`);
}

await Promise.all(routes.map((route) => writePage(route)));
await writePage({ pathname: '/404/', pageType: 'not-found', title: 'Page not found | Keval Darji', description: 'The requested page could not be found.', data: null }, '404.html');
const escapeXml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
const sitemap = routes.map((route) => `<url><loc>${escapeXml(new URL(siteBase(route.pathname, basePath), siteUrl).href)}</loc></url>`).join('\n');
await writeFile(path.join(outputRoot, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap}\n</urlset>\n`);

export async function verifyRequiredOutput(outputDirectory: string, generatedRoutes: StaticRoute[] = []): Promise<void> {
  const requiredOutput = [...new Set([
    outputFileFor('/'),
    outputFileFor('/learning/'),
    ...generatedRoutes.map((route) => outputFileFor(route.pathname)),
  ])];
  const exists = await Promise.all(
    requiredOutput.map(async (relativePath) => {
      try {
        await access(path.join(outputDirectory, relativePath));
        return true;
      } catch {
        return false;
      }
    }),
  );
  const missing = requiredOutput.filter((_, index) => !exists[index]);

  if (missing.length > 0) {
    throw new Error(`Static render is missing required output: ${missing.join(', ')}`);
  }
}

await verifyRequiredOutput(outputRoot, routes);
console.log(`Rendered ${routes.length} static pages, 404.html, and sitemap.xml (base: ${basePath}).`);
