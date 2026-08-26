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
  viewChild,
} from '@angular/core';

type StatIcon = 'briefcase' | 'globe' | 'handshake' | 'growth';

interface Stat {
  readonly icon: StatIcon;
  readonly value: string;
  readonly label: string;
}

interface TeamMember {
  readonly name: string;
  readonly role: string;
  /** Portrait in `/assets/images/`, or null to fall back to the BWG mark. */
  readonly photo: string | null;
  readonly bio: string;
  readonly expertise: readonly string[];
}

/**
 * The rest of the leadership team.
 *
 * Empty on purpose. The grid and its heading render only when this has entries —
 * an empty state or a row of placeholder cards would be worse than no section at
 * all. Adding a member here is the only edit needed to bring the grid to life.
 */
const TEAM: readonly TeamMember[] = [];

const PORTRAIT = {
  src: '/assets/images/ceo-portrait.jpg',
  // The file's intrinsic size. Written onto the element so the browser reserves
  // the right box before the image arrives, and matched by the media slot's
  // aspect-ratio so the card cannot reflow while it loads.
  width: 1088,
  height: 974,
  alt: 'Dr. Basem Hashaad, Chief Executive Officer of Business World Group',
} as const;

/** The caption printed inside the portrait card, under the image. */
const PORTRAIT_CAPTION = {
  name: 'Dr. Basem Hashaad',
  role: 'Chief Executive Officer',
  org: 'BWG',
} as const;

/** All copy verbatim. */
const COPY = {
  eyebrow: 'STRATEGIC VISION · GLOBAL PARTNERSHIPS · SUSTAINABLE GROWTH',
  name: 'Dr. Basem Hashaad',
  role: 'Chief Executive Officer',
  org: 'Business World Group (BWG)',
  intro:
    'A distinguished international trade and business development executive with more than 25 years of experience in trade policy, compliance, facilitation and strategic development across Egypt, the MENA region and the GCC.',
  bioHeading: 'About Dr. Hashaad',
  bio: [
    'Dr. Basem Hashaad is a distinguished international trade and business development executive with more than 25 years of experience in trade policy, trade compliance, trade facilitation, economic analysis, international negotiations, and strategic development across Egypt, the MENA region, and the GCC.',
    'As Chief Executive Officer of Business World Group (BWG), Dr. Hashaad brings extensive governmental, institutional, and private-sector experience to the Group, with a strong focus on transforming strategic opportunities into sustainable business growth, developing international partnerships, and creating value across markets.',
    "Prior to joining BWG, Dr. Hashaad spent more than 15 years within Egypt's Ministry of Trade and Industry, where he held senior responsibilities within the Foreign Trade Sector. Throughout his tenure, he played a key role in international trade negotiations and trade-policy development, with particular expertise in Rules of Origin and the technical preparation of bilateral and multilateral trade protocols and agreements.",
    "His professional experience includes engagement with prominent international and regional organizations and trade institutions, including the World Trade Organization (WTO), World Customs Organization (WCO), European Union (EU), European Free Trade Association (EFTA), Common Market for Eastern and Southern Africa (COMESA), Organisation of Islamic Cooperation's Standing Committee for Economic and Commercial Cooperation (COMCEC), and MERCOSUR.",
    'Dr. Hashaad is recognized for his strategic thinking, analytical capabilities, negotiation expertise, and strong stakeholder-management skills. His career has involved working closely with government institutions, international organizations, corporate stakeholders, funding partners, and senior decision-makers, enabling him to navigate complex economic, operational, regulatory, and organizational environments effectively.',
    'In addition to his expertise in international trade, he has significant experience in economic research, trade facilitation, institutional development, change management, crisis communication, sustainability, and community development. He is also an accomplished presenter and communicator, with the ability to translate complex economic and trade issues into practical strategic directions.',
    "At BWG, Dr. Basem Hashaad leads the Group's strategic vision and growth agenda, leveraging his extensive international trade expertise, institutional relationships, and entrepreneurial mindset to expand BWG's regional and international presence and develop high-value business opportunities and strategic partnerships.",
  ],
  expertiseHeading: 'Core Areas of Expertise',
  expertise: [
    'International Trade & Trade Policy',
    'Trade Compliance',
    'Trade Facilitation',
    'Economic Analysis',
    'International Negotiations',
    'Strategic Business Development',
    'Economic Research',
    'Stakeholder & Institutional Relations',
    'Market Development',
    'Sustainability & Community Development',
    'Strategic Planning',
  ],
  quote: 'Building bridges for a stronger, more connected and sustainable world.',
  closingLead: 'Driving Global Opportunities.',
  closingAccent: 'Creating Lasting Value.',
  teamHeading: 'The BWG Leadership Team',
} as const;

/**
 * How many bio paragraphs stay visible when collapsed.
 *
 * The cut falls between paragraphs, never inside one, so the collapsed state
 * always ends on a finished sentence.
 */
const BIO_VISIBLE = 2;

const STATS: readonly Stat[] = [
  { icon: 'briefcase', value: '25+', label: 'Years of Experience' },
  { icon: 'globe', value: 'Global', label: 'Trade Expertise' },
  { icon: 'handshake', value: 'International', label: 'Partnerships' },
  { icon: 'growth', value: 'Sustainable', label: 'Business Growth' },
];

/**
 * Our Leaders.
 *
 * A homepage section. It was the site's only standalone route until every other
 * destination turned out to be an anchor; /leadership now redirects here.
 */
@Component({
  selector: 'bwg-leaders',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './leaders.html',
  styleUrl: './leaders.scss',
})
export class Leaders {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly copy = COPY;
  protected readonly stats = STATS;
  protected readonly team = TEAM;
  protected readonly portrait = PORTRAIT;
  protected readonly caption = PORTRAIT_CAPTION;

  /**
   * The bio, split for display only.
   *
   * Both halves are always rendered — the collapse is visual, so every paragraph
   * is in the DOM and in the prerendered HTML in either state.
   */
  protected readonly bioLead = COPY.bio.slice(0, BIO_VISIBLE);
  protected readonly bioRest = COPY.bio.slice(BIO_VISIBLE);
  protected readonly bioVisibleCount = BIO_VISIBLE;

  /** Whether the rest of the bio is showing. */
  protected readonly bioExpanded = signal(false);

  /**
   * Which cards are showing their back, keyed by name.
   *
   * A set rather than a single index: opening one card should not close another
   * the reader is still reading.
   */
  private readonly bioRef = viewChild<ElementRef<HTMLElement>>('bio');

  private readonly opened = signal<ReadonlySet<string>>(new Set<string>());

  /**
   * Plays the entrance. Fails open — the finished state is the CSS default and
   * this only adds a class that animates it in, so if the observer never runs
   * the page is still fully visible.
   */
  protected readonly revealed = signal(false);

  constructor() {
    afterNextRender(() => this.watchReveal());
  }

  /**
   * Expands in place; collapsing returns the reader to the top of the bio.
   *
   * Without that, collapsing from the foot of a long bio would leave them
   * somewhere far down the page with no idea what moved.
   */
  protected toggleBio(): void {
    const next = !this.bioExpanded();
    this.bioExpanded.set(next);

    if (!next) {
      this.restoreBioPosition();
    }
  }

  private restoreBioPosition(): void {
    const element = this.bioRef()?.nativeElement;
    if (!this.isBrowser || !element) {
      return;
    }

    // Only if the reader has actually scrolled past the top of the bio. Scrolling
    // when it is already on screen would be a jump for no reason.
    if (element.getBoundingClientRect().top >= 0) {
      return;
    }

    const view = element.ownerDocument?.defaultView;
    const reduce = view?.matchMedia('(prefers-reduced-motion: reduce)').matches ?? false;
    element.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }

  protected isOpen(name: string): boolean {
    return this.opened().has(name);
  }

  /** Toggles a card. Bound to click, so Enter and Space come free from <button>. */
  protected toggle(name: string): void {
    const next = new Set(this.opened());
    if (!next.delete(name)) {
      next.add(name);
    }
    this.opened.set(next);
  }

  private watchReveal(): void {
    if (!this.isBrowser) {
      return;
    }

    const view = this.host.nativeElement.ownerDocument?.defaultView;
    if (view?.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Nothing to play, and the default state is already the finished one.
      return;
    }

    this.zone.runOutsideAngular(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) {
            return;
          }
          observer.disconnect();
          this.zone.run(() => this.revealed.set(true));
        },
        { rootMargin: '0px 0px -10% 0px', threshold: 0 },
      );

      observer.observe(this.host.nativeElement);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
