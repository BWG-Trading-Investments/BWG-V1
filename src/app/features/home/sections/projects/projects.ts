import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The projects section.
 *
 * All copy is verbatim from the BWG website data document. Nothing here is
 * paraphrased or invented; where the source contains a typo it is reproduced as
 * written rather than silently corrected.
 */
interface Project {
  readonly name: string;
  readonly body: string;
}

interface ProjectsCopy {
  readonly eyebrow: string;
  readonly headingLines: readonly string[];
  readonly lead: string;
  readonly projects: readonly Project[];
  readonly closingLines: readonly string[];
}

const COPY: ProjectsCopy = {
  eyebrow: 'Our Projects',
  headingLines: ['FROM IDEAS TO IMPACT', 'WE TURN OPPORTUNITIES INTO BUSINESSES.'],
  lead: 'Across our ecosystem, BWG develops and supports businesses, platforms and strategic initiatives designed to solve real market challenges.',
  projects: [
    { name: 'BUSINESS HUB', body: 'International trade and business intelligence ecosystem connecting companies with global trade opportunities in raw and processed materials, products, machinery, services and systems.' },
    { name: 'MA3DENHA', body: 'A digital loyalty ecosystem designed to transform loyalty value into tangible precious-metal ownership.' },
    { name: 'FISH LINK', body: 'A digital ecosystem designed to modernize and organize the wholesale seafood trade.' },
    { name: 'MOSHAREK', body: 'A platform focused on connecting businesses, opportunities and participation.' },
    { name: 'MADAD', body: 'A digital business platform developed TO FULFILL the needs of basic players in education industry.' },
    { name: 'AKIBAGOLD', body: 'A smart savings concept designed to make precious-metal ownership accessible through digital saving.' },
  ],
  closingLines: ['MORE THAN PROJECTS.', 'These are building blocks of a larger ecosystem.'],
};

@Component({
  selector: 'bwg-projects',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects {
  protected readonly copy = COPY;
}
