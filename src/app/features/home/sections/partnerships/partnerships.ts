import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The partnerships section.
 *
 * All copy is verbatim from the BWG website data document. Nothing here is
 * paraphrased or invented; where the source contains a typo it is reproduced as
 * written rather than silently corrected.
 */
interface PartnershipsCopy {
  readonly eyebrow: string;
  readonly heading: string;
  readonly body: readonly string[];
  readonly partnerToLabel: string;
  readonly partnerTo: readonly string[];
  readonly closing: string;
  readonly cta: string;
}

const COPY: PartnershipsCopy = {
  eyebrow: 'Partner With BWG',
  heading: 'GREAT BUSINESSES ARE BUILT TOGETHER.',
  body: [
    'We believe strategic partnerships create opportunities that individual businesses cannot achieve alone.',
    'BWG works with corporations, investors, technology companies, financial institutions, suppliers, government entities and entrepreneurs to develop mutually valuable opportunities.',
  ],
  partnerToLabel: 'WE PARTNER TO:',
  partnerTo: [
    'Enter new markets.',
    'Develop new products.',
    'Build digital ecosystems.',
    'Create new revenue streams.',
    'Connect businesses with opportunities.',
    'Scale successful concepts.',
  ],
  closing: 'YOUR OPPORTUNITY COULD BE OUR NEXT BUSINESS.',
  cta: 'EXPLORE PARTNERSHIP OPPORTUNITIES',
};

@Component({
  selector: 'bwg-partnerships',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './partnerships.html',
  styleUrl: './partnerships.scss',
})
export class Partnerships {
  protected readonly copy = COPY;
}
