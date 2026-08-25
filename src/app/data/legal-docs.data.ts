/**
 * The legal documents that exist as routes.
 *
 * Single source of truth: the router uses it to render, and the prerenderer
 * uses it to decide which /legal/* pages to emit as static HTML. Adding a
 * document here is enough to make it build.
 */
export const LEGAL_DOCS = ['privacy', 'terms'] as const;

export type LegalDoc = (typeof LEGAL_DOCS)[number];
