import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The why BWG section.
 *
 * All copy is verbatim from the BWG website data document. Nothing here is
 * paraphrased or invented; where the source contains a typo it is reproduced as
 * written rather than silently corrected.
 */
interface Reason {
  readonly title: string;
  readonly body: string;
}

interface WhyCopy {
  readonly eyebrow: string;
  readonly headingLines: readonly string[];
  readonly lead: string;
  readonly reasons: readonly Reason[];
}

const COPY: WhyCopy = {
  eyebrow: 'Why BWG',
  headingLines: ['BEYOND SERVICES.', 'BEYOND TRANSACTIONS.'],
  lead: 'BWG combines multiple business capabilities within one ecosystem, allowing us to identify opportunities, develop business models, build brands, deploy technology and create commercial partnerships.',
  reasons: [
    { title: 'STRATEGIC THINKING', body: 'We look beyond today\'s transaction to understand the opportunity behind it.' },
    { title: 'MULTI-SECTOR EXPERIENCE', body: 'Our capabilities extend across multiple industries, and different markets allowing us to identify connections between markets and opportunities.' },
    { title: 'TECHNOLOGY-DRIVEN', body: 'We use technology to transform traditional business models into scalable digital ecosystems.' },
    { title: 'MARKET ACCESS', body: 'We connect businesses with, partners, suppliers, investors and strategic opportunities in more than 25 markets' },
    { title: 'EXECUTION', body: 'Ideas create potential. Execution creates value.' },
    { title: 'LONG-TERM PARTNERSHIPS', body: 'We build relationships designed around sustainable growth rather than short-term transactions.' },
  ],
};

@Component({
  selector: 'bwg-why',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './why.html',
  styleUrl: './why.scss',
})
export class Why {
  protected readonly copy = COPY;
}
