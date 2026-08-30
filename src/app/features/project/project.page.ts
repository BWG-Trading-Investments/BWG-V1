import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BWG_LOCKUP } from '../../data/leaders.data';
import { type Project, findProject } from '../../data/projects.data';
import { Icon } from '../../shared/ui/icon/icon';

/**
 * One project's page.
 *
 * A single component serves all of them: everything on the page comes from the
 * record in data/projects.data.ts that the slug resolves to, so adding a project
 * is a data edit and nothing more. It is deliberately the same arrangement as
 * the leader profiles — mark, name, standfirst, body, blocks, a closing grid —
 * because the two are the site's only detail pages and they should not feel like
 * two different sites.
 *
 * Every section is conditional on its own data. A project with no overview, no
 * blocks or no highlights simply does not render those parts.
 *
 * The outbound link to a live site lives here and only here. It used to sit on
 * the homepage card, which meant the two projects with a site were the only ones
 * you could click and they took you straight off the site; now every card leads
 * here first, and leaving for the live product is a decision made on the page
 * about it.
 */
@Component({
  selector: 'bwg-project-page',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './project.page.html',
  styleUrl: './project.page.scss',
})
export class ProjectPage {
  /** Bound from the `:slug` route param by withComponentInputBinding(). */
  readonly slug = input.required<string>();

  /** The lockup is the group's, not the leadership section's — shared from there. */
  protected readonly lockup = BWG_LOCKUP;

  /** The resolved project, or null when the slug is not one of ours. */
  protected readonly project = computed<Project | null>(() => findProject(this.slug()) ?? null);
}
