import { Routes } from '@angular/router';
import { HomePage } from './features/home/home.page';

const SITE = 'BWG';

/**
 * Home is imported eagerly — it is the landing route, so deferring it would only
 * add a round trip. Every other page is lazy.
 *
 * About, Our Ecosystem, Our Projects, Partnerships, Invest and Contact are
 * deliberately absent from this table: they are anchors on the homepage
 * (#about, #ecosystem, …), not routes. core/navigation.ts is the single source
 * of truth for those, and it is what the navbar renders from.
 *
 * Only Our Leaders is a real route, and it keeps this repo's existing path name
 * — `leadership`, not `leaders`. The nav config bends to the route.
 */
export const routes: Routes = [
  {
    path: '',
    component: HomePage,
    title: 'BWG — Business World Group | Build. Grow. Invest.',
  },
  {
    path: 'leadership',
    title: `Leadership — ${SITE}`,
    loadComponent: () =>
      import('./features/leadership/leadership.page').then((m) => m.LeadershipPage),
  },
  {
    path: 'legal/:doc',
    title: `Legal — ${SITE}`,
    loadComponent: () => import('./features/legal/legal.page').then((m) => m.LegalPage),
  },
  {
    path: '**',
    title: `Page not found — ${SITE}`,
    loadComponent: () =>
      import('./features/not-found/not-found.page').then((m) => m.NotFoundPage),
  },
];
