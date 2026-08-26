import { NgTemplateOutlet, isPlatformBrowser } from '@angular/common';
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

import { CardTilt } from './card-tilt';

type ProjectIcon = 'globe' | 'bullion' | 'fish' | 'people' | 'screen' | 'jar';

interface Project {
  readonly name: string;
  readonly body: string;
  readonly icon: ProjectIcon;
  /**
   * The live site, or null while the project has none.
   *
   * This is the only thing that decides whether a card is a link. Giving a
   * project a URL here turns its card into an anchor, adds the external-link
   * affordance and the hover state, and nothing else has to change.
   */
  readonly url: string | null;
  /**
   * Card artwork, or null while there is none.
   *
   * These are brand marks, not photographs, so they are always fitted whole and
   * never cropped. Images belong in `src/assets/images/` and are referenced from
   * `/assets/…` — that is the directory the build actually copies; the `assets/`
   * folder at the repo root is not in angular.json and never reaches dist.
   */
  readonly image: string | null;
  /** The file's own pixel size, so the browser gets the right aspect hint. */
  readonly imageWidth: number | null;
  readonly imageHeight: number | null;
  /**
   * True when the file has no transparency.
   *
   * Such a mark cannot sit straight on a dark card: MA3DANHA's arrives on
   * opaque white and is largely black, so it would read as a slab at best and be
   * invisible at worst. Those get a light plate behind them. The artwork itself
   * is never recoloured or overlaid.
   */
  readonly imageOnPlate: boolean;
}

/** All copy verbatim. */
const PROJECTS: readonly Project[] = [
  {
    name: 'BUSINESS HUB',
    body: 'International trade and business intelligence ecosystem connecting companies with global trade opportunities in raw and processed materials, products, machinery, services and systems.',
    icon: 'globe',
    url: null,
    image: null,
    imageWidth: null,
    imageHeight: null,
    imageOnPlate: false,
  },
  {
    name: 'MA3DANHA',
    body: 'A digital loyalty ecosystem designed to transform loyalty value into tangible precious-metal ownership.',
    icon: 'bullion',
    url: null,
    // Opaque white, and mostly black artwork — needs the plate.
    image: '/assets/images/ma3denha_f.png',
    imageWidth: 1536,
    imageHeight: 1024,
    imageOnPlate: true,
  },
  {
    name: 'FISH LINK',
    body: 'A digital ecosystem designed to modernize and organize the wholesale seafood trade.',
    icon: 'fish',
    url: 'https://www.fishlink.co/',
    image: null,
    imageWidth: null,
    imageHeight: null,
    imageOnPlate: false,
  },
  {
    name: 'MOSHAREK',
    body: 'A platform focused on connecting businesses, opportunities and participation.',
    icon: 'people',
    url: null,
    image: null,
    imageWidth: null,
    imageHeight: null,
    imageOnPlate: false,
  },
  {
    name: 'MADAD',
    body: 'A digital business platform developed to fulfill the needs of basic players in the education industry.',
    icon: 'screen',
    url: 'https://www.madaaad.com/',
    // Genuinely transparent, so it sits straight on the card with no plate.
    image: '/assets/images/app_mark.png',
    imageWidth: 1024,
    imageHeight: 1024,
    imageOnPlate: false,
  },
  {
    name: 'AKIBAGOLD',
    body: 'A smart savings concept designed to make precious-metal ownership accessible through digital saving.',
    icon: 'jar',
    url: null,
    image: null,
    imageWidth: null,
    imageHeight: null,
    imageOnPlate: false,
  },
];

interface ProjectsCopy {
  readonly eyebrow: string;
  readonly heading: string;
  readonly subhead: string;
  readonly lead: string;
  readonly closingLead: string;
  readonly closingAccent: string;
}

const COPY: ProjectsCopy = {
  eyebrow: 'OUR PROJECTS',
  heading: 'FROM IDEAS TO IMPACT',
  subhead: 'WE TURN OPPORTUNITIES INTO BUSINESSES.',
  lead: 'Across our ecosystem, BWG develops and supports businesses, platforms and strategic initiatives designed to solve real market challenges.',
  closingLead: 'MORE THAN PROJECTS.',
  closingAccent: 'These are building blocks of a larger ecosystem.',
};

/**
 * Our Projects.
 *
 * Six cards. The two with a live site are anchors; the four without are plain
 * elements, so nothing invites a click that leads nowhere.
 */
@Component({
  selector: 'bwg-projects',
  imports: [NgTemplateOutlet, CardTilt],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly copy = COPY;
  protected readonly projects = PROJECTS;

  /**
   * Plays the entrance. Fails open: the finished state is the CSS default and
   * this only adds a class that animates it in, so if the observer never runs —
   * no JavaScript, an old browser, an error earlier on the page — the section is
   * still fully visible rather than stuck at opacity zero.
   */
  protected readonly revealed = signal(false);

  constructor() {
    afterNextRender(() => this.watchReveal());
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
