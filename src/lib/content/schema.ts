import { z } from 'zod';

export const learningItemKinds = [
  'topics',
  'notes',
] as const;

export type LearningItemKind = (typeof learningItemKinds)[number];

const nonEmptyText = z.string().trim().min(1);

export const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'must be a lowercase hyphenated identifier');

function isCalendarDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return false;
  }

  const [, year, month, day] = match;
  const parsed = new Date(`${value}T00:00:00.000Z`);

  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.getUTCFullYear() === Number(year) &&
    parsed.getUTCMonth() + 1 === Number(month) &&
    parsed.getUTCDate() === Number(day)
  );
}

const markdownDateSchema = z
  .string()
  .refine(isCalendarDate, 'must be a real calendar date in YYYY-MM-DD format');

const githubRepositorySchema = z
  .string()
  .url()
  .refine((value) => {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === 'github.com' && url.pathname.split('/').filter(Boolean).length >= 2;
  }, 'must be an HTTPS GitHub repository URL');

const githubMarkdownFileSchema = z.string().url().refine((value) => {
  const url = new URL(value);
  return url.protocol === 'https:' && url.hostname === 'github.com' && /^\/[^/]+\/[^/]+\/blob\/[^/]+\/.+\.md$/i.test(url.pathname);
}, 'must be an HTTPS GitHub URL to a Markdown file');

const markdownBoolean = z.union([z.boolean(), z.enum(['true', 'false']).transform((value) => value === 'true')]);

export const journeyFrontmatterSchema = z
  .object({
    title: nonEmptyText,
    slug: slugSchema,
    description: nonEmptyText,
    status: z.enum(['planned', 'active', 'paused', 'complete', 'archived']),
    currentFocus: nonEmptyText.optional(),
    repository: githubRepositorySchema.optional(),
    featured: markdownBoolean.default(false),
  })
  .strict();

export const projectFrontmatterSchema = z
  .object({
    title: nonEmptyText,
    slug: slugSchema,
    description: nonEmptyText,
    role: nonEmptyText.optional(),
    status: nonEmptyText.optional(),
    technologies: z.array(nonEmptyText).default([]),
    repository: githubRepositorySchema.optional(),
    url: z.string().url().optional(),
    featured: markdownBoolean.default(false),
  })
  .strict();

export const roleFrontmatterSchema = z.object({
  title: nonEmptyText, company: nonEmptyText, slug: slugSchema,
  started: z.string().regex(/^\d{4}-\d{2}$/), ended: z.string().regex(/^\d{4}-\d{2}$/).optional(),
  current: z.union([z.boolean(), z.enum(['true', 'false']).transform((value) => value === 'true')]).default(false), summary: nonEmptyText, responsibilities: z.array(nonEmptyText).min(1),
}).strict();

export const learningItemFrontmatterSchema = z
  .object({
    title: nonEmptyText,
    slug: slugSchema,
    journey: slugSchema,
    topic: slugSchema.optional(),
    date: markdownDateSchema.optional(),
    description: nonEmptyText,
    referenceUrl: githubMarkdownFileSchema.optional(),
  })
  .strict();

export type JourneyFrontmatter = z.infer<typeof journeyFrontmatterSchema>;
export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;
export type RoleFrontmatter = z.infer<typeof roleFrontmatterSchema>;
export type LearningItemFrontmatter = z.infer<typeof learningItemFrontmatterSchema>;

export interface Journey extends JourneyFrontmatter {
  html: string;
  sourcePath: string;
}

export interface Project extends ProjectFrontmatter {
  html: string;
  sourcePath: string;
}
export interface Role extends RoleFrontmatter { html: string; sourcePath: string; }

export interface LearningItem extends LearningItemFrontmatter {
  kind: LearningItemKind;
  html: string;
  sourcePath: string;
}

export type JourneyStats = Record<LearningItemKind, number>;

export interface PortfolioContent {
  journeys: Journey[];
  projects: Project[];
  roles: Role[];
  learningItems: LearningItem[];
  getJourney(slug: string): Journey | undefined;
  getJourneyStats(slug: string): JourneyStats;
  getJourneyItems(slug: string, kind: LearningItemKind): LearningItem[];
}

export type PortfolioContentLoader = (root: string) => Promise<PortfolioContent>;
