import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BWG_LOCKUP, type Leader, findLeader } from '../../data/leaders.data';
import { Icon } from '../../shared/ui/icon/icon';

/**
 * One leader's profile.
 *
 * A single component serves all of them: everything on the page comes from the
 * record in data/leaders.data.ts that the slug resolves to, so adding a leader
 * is a data edit and nothing more.
 *
 * Every section is conditional on its own data. A leader with no pull quote, no
 * information blocks or no expertise list simply does not render those parts —
 * an empty heading over an empty list would be worse than no block at all.
 */
@Component({
  selector: 'bwg-leader-page',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './leader.page.html',
  styleUrl: './leader.page.scss',
})
export class LeaderPage {
  /** Bound from the `:slug` route param by withComponentInputBinding(). */
  readonly slug = input.required<string>();

  protected readonly lockup = BWG_LOCKUP;

  /** The resolved leader, or null when the slug is not one of ours. */
  protected readonly leader = computed<Leader | null>(() => findLeader(this.slug()) ?? null);
}
