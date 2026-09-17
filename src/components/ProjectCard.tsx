import type { Project } from '../lib/content/schema';
import { MarkdownContent } from './MarkdownContent';
import { useSitePath } from './SitePath';

export function ProjectCard({ project, expanded = false }: { project: Project; expanded?: boolean }) {
  const link = useSitePath();
  return <article className={`project-card${expanded ? ' project-card-expanded' : ''}`} id={expanded ? project.slug : undefined}>
    <div className="project-art" aria-hidden="true"><span className="project-art-mark">{project.title.slice(0, 1)}</span><span className="project-art-line" /><span className="project-art-line" /><span className="project-art-line" /></div>
    <div className="project-card-content">
      {project.status && <p className="eyebrow">{project.status}</p>}
      <h2>{expanded ? project.title : <a href={link(`/projects/#${project.slug}`)}>{project.title} <span aria-hidden="true">↗</span></a>}</h2>
      <p className="project-description">{project.description}</p>
      {project.role && <p className="project-role">{project.role}</p>}
      {project.technologies.length > 0 && <ul className="tag-list" aria-label={`${project.title} technologies`}>{project.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul>}
      {expanded && <MarkdownContent html={project.html} />}
      {(project.url || project.repository) && <div className="project-links">
        {project.url && <a href={project.url}>Visit {project.title} <span aria-hidden="true">↗</span></a>}
        {project.repository && <a href={project.repository}>View {project.title} source <span aria-hidden="true">↗</span></a>}
      </div>}
    </div>
  </article>;
}
