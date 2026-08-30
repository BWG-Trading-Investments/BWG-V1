import { RenderMode, ServerRoute } from '@angular/ssr';

import { ALL_LEADERS } from './data/leaders.data';
import { LEGAL_DOCS } from './data/legal-docs.data';
import { PROJECTS } from './data/projects.data';

/**
 * Every route is prerendered to static HTML at build time (outputMode: 'static'),
 * so there is no server at runtime.
 *
 * Parameterised routes cannot be discovered from the router config alone — they
 * need getPrerenderParams to enumerate their values. legal/:doc, leaders/:slug
 * and projects/:slug are the three, and each enumerates from the same data file
 * its page reads, so a route can never exist without content or vice versa.
 */
export const serverRoutes: ServerRoute[] = [
  {
    path: 'legal/:doc',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => LEGAL_DOCS.map((doc) => ({ doc })),
  },
  {
    path: 'leaders/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => ALL_LEADERS.map(({ slug }) => ({ slug })),
  },
  {
    path: 'projects/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => PROJECTS.map(({ slug }) => ({ slug })),
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
