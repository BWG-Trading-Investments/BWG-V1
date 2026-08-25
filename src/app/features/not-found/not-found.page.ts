import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * 404. A real page with a way back, not a redirect to home — a silent bounce to
 * the landing page hides broken links instead of reporting them.
 *
 * Step-0 placeholder; styled properly once the tokens land.
 */
@Component({
  selector: 'bwg-not-found-page',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Page not found</h1>
    <p>That page does not exist, or it has moved.</p>
    <a routerLink="/">Back to BWG</a>
  `,
})
export class NotFoundPage {}
