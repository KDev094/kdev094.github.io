# Static Portfolio

A React and TypeScript portfolio that converts validated Markdown and YAML frontmatter into real static HTML for GitHub Pages. It has no backend, CMS, or SPA-routing fallback.

## Local workflow

```sh
npm ci
npm run test
npm run check
npm run build
npm run preview
```

`npm run dev` serves Vite's development shell. Use `npm run build` then `npm run preview` to inspect generated portfolio pages. Output is written to `dist/`.

## Content authoring

```text
src/content/
├── projects/<project-slug>.md
├── roles/<company-or-role-slug>.md
└── journeys/<journey-slug>/
    ├── index.md
    ├── topics/<topic-slug>.md
    └── notes/<note-slug>.md
```

Content is discovered automatically. Add Markdown, commit, and push—no React route registration is required.

### Projects

Projects support title, slug, description, role, status, technologies, optional `repository`/`url`, and `featured`.

```yaml
featured: true
repository: https://github.com/owner/repository
```

Home displays at most two `featured: true` projects; Projects displays every project.

### Professional roles

Each file under `src/content/roles/` supports:

```yaml
title: Senior Software Engineer
company: Example Company
slug: example-company
started: 2024-01
ended: 2025-12 # omit for a current role
current: true
summary: A concise description of the role.
responsibilities:
  - Led a responsibility.
  - Partnered on another responsibility.
```

The Work page validates, sorts, and displays these files as a responsive professional timeline.

### Learning journeys and notes

Journey `index.md` files support title, slug, description, status, optional current focus, optional GitHub repository link, and `featured`.

```yaml
featured: true
repository: https://github.com/owner/repository
```

Home displays at most two featured journeys. Topics and Notes are related through `topic: <topic-slug>` in note frontmatter.

An optional `referenceUrl` on a **note only** adds “View source note” beside the date:

```yaml
referenceUrl: https://github.com/owner/repository/blob/main/path/to/note.md
```

It must be an HTTPS GitHub `blob` URL ending in `.md`; other file types and non-note content are rejected during build.

## Profile assets and links

- Place the résumé PDF at `public/resume.pdf`; Home and About download it as `Kev-Resume.pdf`.
- Update placeholder LinkedIn, GitHub, and email destinations in `src/components/SocialLinks.tsx`.
- Keep project and journey repository links in Markdown frontmatter.

## Validation and deployment

Builds reject malformed frontmatter, invalid dates, duplicate slugs, invalid GitHub URLs, and broken topic/journey relationships. Every route is generated as a directory `index.html`, alongside `404.html` and `sitemap.xml`.

For project Pages hosting:

```sh
BASE_PATH=/repository-name/ npm run build
```

`.github/workflows/deploy.yml` uses Node.js 24. On pushes to `main` or manual dispatch, it installs dependencies, runs tests, builds with the repository base path, uploads `dist`, and deploys to GitHub Pages. Enable **GitHub Actions** as the Pages source before the first deployment.
