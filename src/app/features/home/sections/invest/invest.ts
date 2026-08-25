import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The investors section.
 *
 * All copy is verbatim from the BWG website data document. Nothing here is
 * paraphrased or invented; where the source contains a typo it is reproduced as
 * written rather than silently corrected.
 */
interface InvestCopy {
  readonly eyebrow: string;
  readonly heading: string;
  readonly lead: string;
  readonly approachLabel: string;
  readonly approach: readonly string[];
  readonly approachClosing: string;
  readonly body: string;
  readonly closing: string;
  readonly cta: string;
}

const COPY: InvestCopy = {
  eyebrow: 'Invest With BWG',
  heading: 'CAPITAL FOLLOWS OPPORTUNITY.',
  lead: 'BWG identifies emerging market opportunities and develops business models designed for scalable growth.',
  approachLabel: 'Our approach combines:',
  approach: [
    'Market Intelligence',
    'Business Development',
    'Technology',
    'Strategic Partnerships',
    'Execution',
  ],
  approachClosing: 'to create businesses capable of generating sustainable value.',
  body: 'We welcome strategic investors and institutional partners who share our vision for building scalable businesses across Egypt, the Middle East and international markets.',
  closing: 'CATCH THE NEXT OPPORTUNITY WITH US.',
  cta: 'DISCOVER INVESTMENT OPPORTUNITIES',
};

@Component({
  selector: 'bwg-invest',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './invest.html',
  styleUrl: './invest.scss',
})
export class Invest {
  protected readonly copy = COPY;
}
