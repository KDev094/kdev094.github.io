import type { Journey, LearningItem, PortfolioContent } from '../content/schema';

interface RouteMetadata {
  pathname: string;
  title: string;
  description: string;
}

export type StaticRoute = RouteMetadata & (
  | { pageType: 'home' | 'work' | 'projects' | 'learning' | 'about'; data: { content: PortfolioContent } }
  | { pageType: 'journey'; data: { journey: Journey; items: LearningItem[] } }
  | { pageType: 'learning-item'; data: { journey: Journey; item: LearningItem } }
  | { pageType: 'not-found'; data: null }
);

export function createRouteManifest(content: PortfolioContent): StaticRoute[] {
  const routes: StaticRoute[] = [
    { pathname: '/', pageType: 'home', title: 'Keval Darji | Developer & Lifelong Learner', description: 'Selected work, personal projects, and a record of learning by building.', data: { content } },
    { pathname: '/work/', pageType: 'work', title: 'Work | Keval', description: 'How I approach building thoughtful, reliable software.', data: { content } },
    { pathname: '/projects/', pageType: 'projects', title: 'Projects | Keval', description: 'Selected projects and the decisions behind them.', data: { content } },
    { pathname: '/learning/', pageType: 'learning', title: 'Learning | Keval', description: 'Learning journeys, practical experiments, notes, and reflections.', data: { content } },
    { pathname: '/about/', pageType: 'about', title: 'About | Keval', description: 'A developer learning deliberately and building with care.', data: { content } },
  ];

  for (const journey of content.journeys) {
    routes.push({
      pathname: `/learning/${journey.slug}/`, pageType: 'journey',
      title: `${journey.title} | Learning Journey`, description: journey.description,
      data: { journey, items: content.learningItems.filter((item) => item.journey === journey.slug) },
    });
  }

  for (const item of content.learningItems) {
    const journey = content.getJourney(item.journey);
    if (!journey) throw new Error(`Cannot create route for unknown journey: ${item.journey}`);
    routes.push({
      pathname: `/learning/${journey.slug}/${item.kind}/${item.slug}/`, pageType: 'learning-item',
      title: `${item.title} | ${journey.title} Learning Journey`,
      description: item.description, data: { journey, item },
    });
  }

  const seen = new Set<string>();
  for (const route of routes) {
    outputFileFor(route.pathname);
    if (seen.has(route.pathname)) throw new Error(`Duplicate static route: ${route.pathname}`);
    seen.add(route.pathname);
  }
  return routes;
}

export function outputFileFor(pathname: string): string {
  if (pathname === '/') return 'index.html';
  if (!/^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*\/)+$/.test(pathname)) {
    throw new Error(`Invalid static route pathname: ${pathname}`);
  }
  return `${pathname.slice(1)}index.html`;
}
