import type { PortfolioContent } from '../lib/content/schema';
import { PageLayout } from '../components/PageLayout';
import { ProjectCard } from '../components/ProjectCard';

export function ProjectsPage({ content }: { content: PortfolioContent }) {
  return <PageLayout activePath="/projects/" page="projects">
    <header className="page-intro"><p className="eyebrow">Ideas made tangible</p><h1>Selected projects.</h1><p className="lede">A closer look at what I’m building, the decisions behind it, and what the process is teaching me.</p></header>
    <div className="project-grid">{content.projects.map((project) => <ProjectCard key={project.slug} project={project} expanded />)}</div>
  </PageLayout>;
}
