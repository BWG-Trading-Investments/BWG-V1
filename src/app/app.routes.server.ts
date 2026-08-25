import { RenderMode, ServerRoute } from '@angular/ssr';

import { LEGAL_DOCS } from './data/legal-docs.data';

/**
 * Every route is prerendered to static HTML at build time (outputMode: 'static'),
 * so there is no server at runtime.
 *
 * Parameterised routes cannot be discovered from the router config alone — they
 * need getPrerenderParams to enumerate their values. legal/:doc is currently the
 * only such route; any future one follows this same shape.
 */
export const serverRoutes: ServerRoute[] = [
  {
    path: 'legal/:doc',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => LEGAL_DOCS.map((doc) => ({ doc })),
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
