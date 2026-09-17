import type { ReactElement } from 'react';
import type { StaticRoute } from '../lib/routes/manifest';
import { HomePage } from './HomePage';
import { WorkPage } from './WorkPage';
import { ProjectsPage } from './ProjectsPage';
import { LearningPage } from './LearningPage';
import { JourneyPage } from './JourneyPage';
import { LearningItemPage } from './LearningItemPage';
import { AboutPage } from './AboutPage';
import { NotFoundPage } from './NotFoundPage';

export function renderRoute(route: StaticRoute): ReactElement {
  switch (route.pageType) {
    case 'home': return <HomePage content={route.data.content} />;
    case 'work': return <WorkPage content={route.data.content} />;
    case 'projects': return <ProjectsPage content={route.data.content} />;
    case 'learning': return <LearningPage content={route.data.content} />;
    case 'about': return <AboutPage />;
    case 'journey': return <JourneyPage journey={route.data.journey} items={route.data.items} />;
    case 'learning-item': return <LearningItemPage journey={route.data.journey} item={route.data.item} />;
    case 'not-found': return <NotFoundPage />;
  }
}
