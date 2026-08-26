import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  NgZone,
  PLATFORM_ID,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';

type ElementIcon = 'eye' | 'knight' | 'people' | 'chip' | 'handshake' | 'growth';
type CardIcon = 'target' | 'telescope';

interface BuildingBlock {
  readonly label: string;
  readonly icon: ElementIcon;
}

/**
 * A run of copy where some phrases are set in gold.
 *
 * Modelled as segments rather than as markup in the template so the sentence
 * stays one editable string per part, and so nothing has to be escaped or
 * bypassed to get the emphasis in.
 */
interface Segment {
  readonly text: string;
  readonly accent: boolean;
}

interface Card {
  readonly label: string;
  readonly body: string;
  readonly icon: CardIcon;
}

interface AboutCopy {
  readonly eyebrow: string;
  readonly headingLead: string;
  readonly headingAccent: string;
  readonly subhead: string;
  readonly intro: string;
  readonly strength: readonly Segment[];
  readonly isolation: string;
  readonly closing: string;
  readonly blocks: readonly BuildingBlock[];
  readonly cards: readonly Card[];
}

/** All copy verbatim. Nothing paraphrased, nothing invented. */
const COPY: AboutCopy = {
  eyebrow: 'ABOUT BWG',
  headingLead: 'ABOUT',
  headingAccent: 'BWG',
  subhead: 'BUILDING THE BUSINESS OF TOMORROW.',
  intro:
    'BWG is a diversified business group focused on creating and scaling high-value businesses across multiple sectors and markets.',
  strength: [
    { text: 'Our strength comes from the ability to combine ', accent: false },
    { text: 'strategy, creativity, technology, commercial expertise', accent: true },
    { text: ' and ', accent: false },
    { text: 'market access', accent: true },
    { text: ' under one business ecosystem.', accent: false },
  ],
  isolation:
    "We don't believe successful businesses are built in isolation. They are built through the right combination of:",
  closing: 'BWG brings these elements together.',
  blocks: [
    { label: 'Vision.', icon: 'eye' },
    { label: 'Strategy.', icon: 'knight' },
    { label: 'People.', icon: 'people' },
    { label: 'Technology.', icon: 'chip' },
    { label: 'Partnerships.', icon: 'handshake' },
    { label: 'Execution.', icon: 'growth' },
  ],
  cards: [
    {
      label: 'OUR MISSION',
      body: 'To create businesses, partnerships and platforms that generate sustainable economic value.',
      icon: 'target',
    },
    {
      label: 'OUR VISION',
      body: 'To become a leading regional business ecosystem connecting opportunities, businesses and capital across Egypt, the Middle East and international markets.',
      icon: 'telescope',
    },
  ],
};

/**
 * About BWG.
 *
 * Copy on the inline-start side, the mission and vision cards on the inline-end.
 *
 * The reference artwork for this section is light navy on white over a city
 * photograph; only its content and its arrangement are taken from it. The
 * palette here is the site's own, from tokens, with no photograph and no
 * gradients carried across.
 */
@Component({
  selector: 'bwg-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly copy = COPY;

  /**
   * The two cards continue the building-block stagger rather than starting a
   * sequence of their own, so they arrive after the sixth element instead of
   * racing it. Six blocks, so the cards are 6 and 7.
   */
  protected readonly cardOrder = COPY.blocks.length;

  protected readonly revealed = signal(false);

  constructor() {
    afterNextRender(() => this.watchReveal());
  }

  /** Reveal once, when the section first reaches the viewport. */
  private watchReveal(): void {
    if (!this.isBrowser) {
      return;
    }

    const view = this.host.nativeElement.ownerDocument?.defaultView;
    if (view?.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.revealed.set(true);
      return;
    }

    this.zone.runOutsideAngular(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) {
            return;
          }
          // An entrance, not a state: it should not replay on every scroll past.
          observer.disconnect();
          this.zone.run(() => this.revealed.set(true));
        },
        { rootMargin: '0px 0px -15% 0px', threshold: 0 },
      );

      observer.observe(this.host.nativeElement);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
