import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadPortfolioContent } from '../src/lib/content/load';

const fixtures = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures');

describe('loadPortfolioContent', () => {
  afterEach(() => vi.unstubAllEnvs());

  it.each([
    ['/', '/learning/dsa/?view=notes#graphs', '/images/graph.svg', '/learning/dsa/', '/images/reference.svg'],
    ['/portfolio/', '/portfolio/learning/dsa/?view=notes#graphs', '/portfolio/images/graph.svg', '/portfolio/learning/dsa/', '/portfolio/images/reference.svg'],
  ])('resolves root-relative Markdown URLs at build time with base %s', async (basePath, journey, image, referenceLink, referenceImage) => {
    vi.stubEnv('BASE_PATH', basePath);
    const content = await loadPortfolioContent(path.join(fixtures, 'markdown-links'));
    const html = content.projects[0].html;
    expect(html).toContain(`href="${journey}"`);
    expect(html).toContain(`src="${image}"`);
    expect(html).toContain(`href="${referenceLink}"`);
    expect(html).toContain(`src="${referenceImage}"`);
    expect(html).toContain('href="https://example.org/learning/"');
    expect(html).toContain('href="#graphs"');
    expect(html).toContain('href="//cdn.example.org/file"');
    expect(html).toContain('href="../notes/"');
    expect(html).toContain('src="https://cdn.example.org/graph.svg"');
    expect(html).toContain('src="//cdn.example.org/graph.svg"');
    expect(html).toContain('src="../images/graph.svg"');
    expect(html).toContain('<code>[Literal](/leave-this-alone/)</code>');
  });

  it('discovers valid content and derives journey statistics', async () => {
    const content = await loadPortfolioContent(path.join(fixtures, 'valid'));

    expect(content.getJourney('dsa')?.title).toBe('Data Structures & Algorithms');
    expect(content.getJourneyStats('dsa')).toEqual({
      topics: 1,
      notes: 1,
    });
    expect(content.getJourneyItems('dsa', 'notes')).toMatchObject([
      {
        title: 'Understanding BFS vs DFS',
        slug: 'bfs-vs-dfs',
        kind: 'notes',
        journey: 'dsa',
        topic: 'graphs',
      },
    ]);
    expect(content.getJourneyItems('dsa', 'notes')[0]?.html).toContain('<strong>frontier</strong>');
    expect(content.projects[0]?.title).toBe('TaskFlow');
  });

  it('keeps nested learning items associated with their containing journey', async () => {
    const content = await loadPortfolioContent(path.join(fixtures, 'nested-item'));

    expect(content.getJourneyItems('dsa', 'notes')).toMatchObject([
      {
        slug: 'nested-traversal-note',
        journey: 'dsa',
        kind: 'notes',
      },
    ]);
  });

  it('rejects an item that references an unknown journey and reports its source', async () => {
    await expect(loadPortfolioContent(path.join(fixtures, 'broken-reference'))).rejects.toThrow(
      /notes\/orphan\.md: unknown journey/i,
    );
  });

  it('rejects an item that references an unknown topic and reports its source', async () => {
    await expect(loadPortfolioContent(path.join(fixtures, 'broken-topic'))).rejects.toThrow(
      /notes\/unresolved\.md: unknown topic/i,
    );
  });

  it('rejects duplicate slugs within a journey item kind and reports both sources', async () => {
    await expect(loadPortfolioContent(path.join(fixtures, 'duplicate-slug'))).rejects.toThrow(
      /notes\/second\.md: duplicate slug.*notes\/first\.md/i,
    );
  });

  it('rejects malformed frontmatter and reports its source', async () => {
    await expect(loadPortfolioContent(path.join(fixtures, 'invalid-metadata'))).rejects.toThrow(
      /projects\/invalid\.md: invalid frontmatter.*slug/i,
    );
  });

  it('rejects a well-formed date that is not a real calendar day', async () => {
    await expect(loadPortfolioContent(path.join(fixtures, 'invalid-date'))).rejects.toThrow(
      /notes\/impossible-date\.md: invalid frontmatter.*date.*calendar/i,
    );
  });
});
