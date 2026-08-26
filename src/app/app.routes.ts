import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { HomePage } from './features/home/home.page';

const SITE = 'BWG';

/**
 * Home is imported eagerly — it is the landing route, so deferring it would only
 * add a round trip. Every other page is lazy.
 *
 * Every navigation destination on this site is now an anchor on the homepage —
 * About BWG, Our Ecosystem, Our Projects, Our Leaders, Partnerships, Invest and
 * Contact are all sections, not routes. core/navigation.ts is the single source
 * of truth for them, and it is what the navbar renders from.
 *
 * What is left here is the homepage itself, the legal documents, and a redirect
 * for the one path that used to be a page.
 */
export const routes: Routes = [
  {
    path: '',
    component: HomePage,
    title: 'BWG — Business World Group | Build. Grow. Invest.',
  },
  {
    // Our Leaders was a page of its own until it became a homepage section. This
    // keeps every link already published — or indexed — landing on the content
    // rather than on a 404. The fragment is what carries it to the right place:
    // anchorScrolling is enabled in app.config.ts, so the router scrolls to
    // #leaders once the homepage has rendered.
    path: 'leadership',
    pathMatch: 'full',
    redirectTo: () => inject(Router).parseUrl('/#leaders'),
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
