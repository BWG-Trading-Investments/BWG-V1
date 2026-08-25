import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The business ecosystem section.
 *
 * All copy is verbatim from the BWG website data document. Nothing here is
 * paraphrased or invented; where the source contains a typo it is reproduced as
 * written rather than silently corrected.
 */
interface Capability {
  readonly index: string;
  readonly title: string;
  readonly body: string;
}

interface EcosystemCopy {
  readonly eyebrow: string;
  readonly heading: string;
  readonly lead: string;
  readonly capabilities: readonly Capability[];
  readonly closingLines: readonly string[];
}

const COPY: EcosystemCopy = {
  eyebrow: 'Our Business Ecosystem',
  heading: 'ONE GROUP, MULTIPLE CAPABILITIES.',
  lead: 'Our businesses are connected by one objective — creating value.',
  capabilities: [
    { index: '01', title: 'BUSINESS & TRADE', body: 'International trade, commercial representation, sourcing, procurement and market access.' },
    { index: '02', title: 'TECHNOLOGY & DIGITAL', body: 'Digital platforms, business applications, technology-enabled ecosystems and smart business solutions.' },
    { index: '03', title: 'MARKETING & BRANDING', body: 'Brand strategy, marketing, communications, advertising, activations and Event mamagement.' },
    { index: '04', title: 'BUSINESS DEVELOPMENT', body: 'Market entry, strategic growth, partnerships, commercial development and expansion.' },
    { index: '05', title: 'INVESTMENT & VENTURES', body: 'Identifying opportunities, developing business models and connecting businesses with strategic capital.' },
    { index: '06', title: 'SPECIALIZED INDUSTRIES', body: 'Sector-focused ventures and platforms developed around emerging market opportunities.' },
  ],
  closingLines: ['Different capabilities.', 'One connected ecosystem.'],
};

@Component({
  selector: 'bwg-ecosystem',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ecosystem.html',
  styleUrl: './ecosystem.scss',
})
export class Ecosystem {
  protected readonly copy = COPY;
}
