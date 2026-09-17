import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import yaml from 'js-yaml';
import { unified } from 'unified';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import type { Root, RootContent } from 'hast';
import type { output, ZodTypeAny } from 'zod';
import { siteBase } from '../routes/paths';
import {
  journeyFrontmatterSchema,
  learningItemFrontmatterSchema,
  learningItemKinds,
  projectFrontmatterSchema,
  roleFrontmatterSchema,
  type Journey,
  type JourneyStats,
  type LearningItem,
  type LearningItemKind,
  type PortfolioContent,
  type PortfolioContentLoader,
  type Project,
  type Role,
} from './schema';

interface ParsedMarkdown<T> {
  frontmatter: T;
  html: string;
  sourcePath: string;
}

const yamlFrontmatterEngine = {
  parse(source: string): object {
    return yaml.safeLoad(source, { schema: yaml.FAILSAFE_SCHEMA }) as object;
  },
};

async function markdownFiles(directory: string): Promise<string[]> {
  let entries;

  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }

    throw error;
  }

  const nestedFiles = await Promise.all(
    entries
      .sort((left, right) => left.name.localeCompare(right.name))
      .map(async (entry) => {
        const entryPath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
          return markdownFiles(entryPath);
        }

        return entry.isFile() && path.extname(entry.name) === '.md' ? [entryPath] : [];
      }),
  );

  return nestedFiles.flat();
}

function rewriteMarkdownUrls(node: Root | RootContent, basePath: string): void {
  if (node.type === 'element') {
    for (const property of ['href', 'src']) {
      const url = node.properties[property];
      if (typeof url === 'string' && url.startsWith('/') && !url.startsWith('//')) {
        node.properties[property] = siteBase(url, basePath);
      }
    }
  }
  if ('children' in node) {
    for (const child of node.children) rewriteMarkdownUrls(child, basePath);
  }
}

function demoteMarkdownHeadings(node: Root | RootContent): void {
  if (node.type === 'element' && node.tagName === 'h1') node.tagName = 'h2';
  if ('children' in node) for (const child of node.children) demoteMarkdownHeadings(child);
}

async function renderMarkdown(markdown: string): Promise<string> {
  const basePath = process.env.BASE_PATH ?? '/';
  const rendered = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(() => (tree: Root) => rewriteMarkdownUrls(tree, basePath))
    .use(() => (tree: Root) => demoteMarkdownHeadings(tree))
    .use(rehypeStringify)
    .process(markdown);

  return String(rendered);
}

async function parseMarkdown<TSchema extends ZodTypeAny>(
  sourcePath: string,
  schema: TSchema,
  documentType: string,
): Promise<ParsedMarkdown<output<TSchema>>> {
  let document;

  try {
    document = matter(await readFile(sourcePath, 'utf8'), {
      engines: { yaml: yamlFrontmatterEngine },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`${sourcePath}: unable to parse ${documentType}: ${message}`);
  }

  const parsed = schema.safeParse(document.data);

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `${issue.path.join('.') || 'frontmatter'} ${issue.message}`)
      .join('; ');
    throw new Error(`${sourcePath}: invalid frontmatter for ${documentType}: ${issues}`);
  }

  return {
    frontmatter: parsed.data,
    html: await renderMarkdown(document.content),
    sourcePath,
  };
}

function assertUniqueSlug(
  seen: Map<string, string>,
  key: string,
  sourcePath: string,
  label: string,
): void {
  const previousSource = seen.get(key);

  if (previousSource) {
    throw new Error(`${sourcePath}: duplicate slug for ${label}; first declared in ${previousSource}`);
  }

  seen.set(key, sourcePath);
}

async function loadProjects(contentRoot: string): Promise<Project[]> {
  const seen = new Map<string, string>();
  const projects = await Promise.all(
    (await markdownFiles(path.join(contentRoot, 'projects'))).map(async (sourcePath) => {
      const parsed = await parseMarkdown(
        sourcePath,
        projectFrontmatterSchema,
        'project',
      );
      return { ...parsed.frontmatter, html: parsed.html, sourcePath };
    }),
  );

  for (const project of projects) {
    assertUniqueSlug(seen, project.slug, project.sourcePath, 'project');
  }

  return projects;
}

async function loadRoles(contentRoot: string): Promise<Role[]> {
  const seen = new Map<string, string>();
  const roles = await Promise.all((await markdownFiles(path.join(contentRoot, 'roles'))).map(async (sourcePath) => {
    const parsed = await parseMarkdown(sourcePath, roleFrontmatterSchema, 'role');
    return { ...parsed.frontmatter, html: parsed.html, sourcePath };
  }));
  for (const role of roles) assertUniqueSlug(seen, role.slug, role.sourcePath, 'role');
  return roles.sort((a, b) => Number(b.current) - Number(a.current) || b.started.localeCompare(a.started));
}

async function loadJourneyDirectory(
  journeyDirectory: string,
): Promise<{ journey: Journey; items: LearningItem[] }> {
  const journeySource = path.join(journeyDirectory, 'index.md');
  const parsedJourney = await parseMarkdown(
    journeySource,
    journeyFrontmatterSchema,
    'journey',
  );
  const journey: Journey = {
    ...parsedJourney.frontmatter,
    html: parsedJourney.html,
    sourcePath: journeySource,
  };
  const directorySlug = path.basename(journeyDirectory);

  if (journey.slug !== directorySlug) {
    throw new Error(
      `${journeySource}: journey slug "${journey.slug}" does not match directory "${directorySlug}"`,
    );
  }

  const groups = await Promise.all(
    learningItemKinds.map(async (kind) => {
      const files = await markdownFiles(path.join(journeyDirectory, kind));
      return Promise.all(
        files.map(async (sourcePath): Promise<LearningItem> => {
          const parsed = await parseMarkdown(
            sourcePath,
            learningItemFrontmatterSchema,
            kind.slice(0, -1),
          );
          return {
            ...parsed.frontmatter,
            kind,
            html: parsed.html,
            sourcePath,
          };
        }),
      );
    }),
  );

  return { journey, items: groups.flat() };
}

async function loadJourneys(
  contentRoot: string,
): Promise<{ journeys: Journey[]; items: LearningItem[] }> {
  const journeysRoot = path.join(contentRoot, 'journeys');
  let entries;

  try {
    entries = await readdir(journeysRoot, { withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return { journeys: [], items: [] };
    }

    throw error;
  }

  const loaded = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .sort((left, right) => left.name.localeCompare(right.name))
      .map((entry) => loadJourneyDirectory(path.join(journeysRoot, entry.name))),
  );

  return {
    journeys: loaded.map(({ journey }) => journey),
    items: loaded.flatMap(({ items }) => items),
  };
}

function validateRelationships(journeys: Journey[], items: LearningItem[]): void {
  const journeySources = new Map<string, string>();

  for (const journey of journeys) {
    assertUniqueSlug(journeySources, journey.slug, journey.sourcePath, 'journey');
  }

  const itemSources = new Map<string, string>();

  for (const item of items) {
    if (item.referenceUrl && item.kind !== 'notes') {
      throw new Error(`${item.sourcePath}: referenceUrl is only supported on learning notes`);
    }
    const journey = journeys.find(({ slug }) => slug === item.journey);

    if (!journey) {
      throw new Error(`${item.sourcePath}: unknown journey "${item.journey}"`);
    }

    const containingJourney = journeys.find((candidate) => {
      const kindRoot = path.join(path.dirname(candidate.sourcePath), item.kind);
      const relativeSource = path.relative(kindRoot, item.sourcePath);

      return (
        relativeSource !== '' &&
        relativeSource !== '..' &&
        !relativeSource.startsWith(`..${path.sep}`) &&
        !path.isAbsolute(relativeSource)
      );
    });

    if (containingJourney?.slug !== item.journey) {
      throw new Error(
        `${item.sourcePath}: journey reference "${item.journey}" does not match containing journey "${containingJourney?.slug ?? 'unknown'}"`,
      );
    }

    const duplicateKey = `${item.journey}:${item.kind}:${item.slug}`;
    assertUniqueSlug(itemSources, duplicateKey, item.sourcePath, `${item.journey}/${item.kind}`);
  }

  for (const item of items) {
    if (!item.topic) {
      continue;
    }

    const topicExists = items.some(
      (candidate) =>
        candidate.kind === 'topics' &&
        candidate.journey === item.journey &&
        candidate.slug === item.topic,
    );

    if (!topicExists) {
      throw new Error(`${item.sourcePath}: unknown topic "${item.topic}" in journey "${item.journey}"`);
    }
  }
}

const emptyStats = (): JourneyStats => ({
  topics: 0,
  notes: 0,
});

export const loadPortfolioContent: PortfolioContentLoader = async (root) => {
  const [projects, roles, journeyContent] = await Promise.all([loadProjects(root), loadRoles(root), loadJourneys(root)]);
  const { journeys, items: learningItems } = journeyContent;

  validateRelationships(journeys, learningItems);

  return {
    journeys,
    projects,
    roles,
    learningItems,
    getJourney(slug) {
      return journeys.find((journey) => journey.slug === slug);
    },
    getJourneyStats(slug) {
      return learningItems
        .filter((item) => item.journey === slug)
        .reduce((stats, item) => {
          stats[item.kind] += 1;
          return stats;
        }, emptyStats());
    },
    getJourneyItems(slug, kind) {
      return learningItems.filter((item) => item.journey === slug && item.kind === kind);
    },
  };
};

export type {
  Journey,
  JourneyStats,
  LearningItem,
  LearningItemKind,
  PortfolioContent,
  PortfolioContentLoader,
  Project,
  Role,
} from './schema';
