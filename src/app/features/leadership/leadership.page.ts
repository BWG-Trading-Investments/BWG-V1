import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Our Leaders. Reached from the navbar's one real route link.
 *
 * Step-0 placeholder — it exists so `/leadership` resolves and the navbar's
 * route link is real. Styled properly once the tokens land.
 */
@Component({
  selector: 'bwg-leadership-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<h1>Our Leaders</h1>`,
})
export class LeadershipPage {}
