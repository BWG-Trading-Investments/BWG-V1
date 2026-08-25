import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { LEGAL_DOCS, type LegalDoc } from '../../data/legal-docs.data';

/**
 * A legal document. Kept as a real route because an investor-facing site needs
 * real privacy and terms pages, and because legal-docs.data.ts already drives
 * both this page and the prerenderer's getPrerenderParams block.
 *
 * Step-0 placeholder — it renders the resolved slug and nothing more. The
 * document bodies and styling land with the tokens.
 */
@Component({
  selector: 'bwg-legal-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (resolved(); as slug) {
      <h1>{{ slug }}</h1>
    } @else {
      <h1>Document not found</h1>
    }
  `,
})
export class LegalPage {
  /** Bound from the `:doc` route param by withComponentInputBinding(). */
  readonly doc = input.required<string>();

  /** Narrows the raw param to a known document, or null if it is not one. */
  protected readonly resolved = computed<LegalDoc | null>(() => {
    const value = this.doc();
    return (LEGAL_DOCS as readonly string[]).includes(value) ? (value as LegalDoc) : null;
  });
}
