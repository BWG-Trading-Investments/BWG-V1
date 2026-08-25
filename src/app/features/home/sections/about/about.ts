import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The about section.
 *
 * All copy is verbatim from the BWG website data document. Nothing here is
 * paraphrased or invented; where the source contains a typo it is reproduced as
 * written rather than silently corrected.
 */
interface AboutCopy {
  readonly eyebrow: string;
  readonly heading: string;
  readonly body: readonly string[];
  readonly combinationIntro: string;
  readonly combination: readonly string[];
  readonly combinationClosing: string;
  readonly missionLabel: string;
  readonly mission: string;
  readonly visionLabel: string;
  readonly vision: string;
}

const COPY: AboutCopy = {
  eyebrow: 'About BWG',
  heading: 'BUILDING THE BUSINESS OF TOMORROW.',
  body: [
    'BWG is a diversified business group focused on creating and scaling high-value businesses across multiple sectors and markets.',
    'Our strength comes from the ability to combine strategy, creativity, technology, commercial expertise and market access under one business ecosystem.',
    'We don\'t believe successful businesses are built in isolation.',
  ],
  combinationIntro: 'They are built through the right combination of:',
  combination: [
    'Vision.',
    'Strategy.',
    'People.',
    'Technology.',
    'Partnerships.',
    'Execution.',
  ],
  combinationClosing: 'BWG brings these elements together.',
  missionLabel: 'Our Mission',
  mission:
    'At BWG, we serve as a strategic bridge that closes the gaps between innovative entrepreneurs and ambitious investors, as well as between business owners and their target clients. We are committed to transforming operational challenges and market gaps into promising investment opportunities and driving business performance by integrating scientific knowledge with cutting-edge technological solutions—ensuring sustainable economic value and growth and added value for all our partners.',
  visionLabel: 'Our Vision',
  vision:
    'To be one of the leading regional advisory and investment ecosystems, and the most trusted strategic partner in trade, business management, and development, by connecting opportunities, businesses and capital across Egypt, MENA Region, and international markets and building a sustainable network of smart partnerships and acquiring influential stakes in robust companies.',
};

@Component({
  selector: 'bwg-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  protected readonly copy = COPY;
}
