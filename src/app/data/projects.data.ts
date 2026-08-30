import type { IconName } from '../shared/ui/icon/icon';

/**
 * The project portfolio.
 *
 * One record per project, read by both the homepage section and the detail
 * pages, so nothing about a project is written down twice — the same shape the
 * leadership roster uses in data/leaders.data.ts, and for the same reason.
 *
 * `name`, `cardSummary` and `url` are client copy, verbatim, and were the whole
 * of a project before it had a page of its own. Everything from `tagline` down
 * is the detail page: it elaborates that supplied one-liner into a sector, an
 * overview, a set of capability blocks and a list of highlights, and it makes no
 * claim the one-liner does not already support — no figures, no named partners,
 * no dates. Those go in here once BWG supplies them.
 *
 * Every block on a detail page is optional. A project with no overview, no
 * blocks or no highlights simply does not render those parts, rather than
 * rendering an empty heading.
 */

/** One of the capability blocks on a detail page. */
export interface ProjectBlock {
  readonly icon: IconName;
  readonly heading: string;
  readonly body: string;
}

/** One item in a project's At a Glance grid. */
export interface ProjectHighlight {
  readonly icon: IconName;
  readonly label: string;
}

export interface Project {
  /** URL segment: /projects/<slug>. */
  readonly slug: string;
  readonly name: string;
  /** The line under the name on the detail page. */
  readonly tagline: string;
  /** Where the project sits in the BWG ecosystem. Shown as a chip. */
  readonly sector: string;
  /** The mark on the card and at the head of the detail page. */
  readonly icon: IconName;
  /**
   * The live site, or null while the project has none.
   *
   * This is what decides whether the detail page offers a visit button. It is no
   * longer what decides whether the card is a link: every card now links to the
   * project's own page, and the outbound link lives there.
   */
  readonly url: string | null;
  /**
   * The host, used as the visit button's label. Kept beside `url` so nothing has
   * to parse a URL at render time, on the server or in the browser.
   */
  readonly urlLabel: string | null;
  /**
   * Card and page artwork, or null while there is none.
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
   * A mark that arrives on an opaque white ground cannot sit straight on a dark
   * card — it would read as a white slab — so it gets a light plate behind it
   * instead, and the artwork itself is never recoloured or overlaid.
   *
   * No project needs this today: every supplied mark has a real alpha channel.
   * MA3DANHA used to be the exception and is not any more, so it now sits on the
   * same ink plate as the rest. Set this only for a file that genuinely has no
   * transparency, and check the file before you do — a stale  here is a
   * white box on a dark card.
   */
  readonly imageOnPlate: boolean;
  /** One line on the card, and the standfirst on the page. Client copy, verbatim. */
  readonly cardSummary: string;
  /** The opening line of the detail page, set larger than the body. */
  readonly intro: string;
  readonly overview: readonly string[];
  readonly blocks: readonly ProjectBlock[];
  readonly highlights: readonly ProjectHighlight[];
}

/** Shown in the homepage section, in this order. */
export const PROJECTS: readonly Project[] = [
  {
    slug: 'business-hub',
    name: 'BUSINESS HUB',
    tagline: 'Connecting companies with global trade opportunities',
    sector: 'Business & Trade',
    icon: 'globe',
    url: null,
    urlLabel: null,
    image: null,
    imageWidth: null,
    imageHeight: null,
    imageOnPlate: false,
    cardSummary:
      'International trade and business intelligence ecosystem connecting companies with global trade opportunities in raw and processed materials, products, machinery, services and systems.',
    intro:
      'An international trade and business intelligence ecosystem, built to connect companies with global trade opportunities.',
    overview: [
      'BUSINESS HUB is the trade side of the BWG ecosystem: an environment where companies looking to buy, sell, source or represent can find the counterpart, the market and the intelligence to act on an opportunity.',
      'Its scope runs across the full breadth of what moves between markets — raw and processed materials, finished products, machinery, services and systems — rather than a single category, so a company can bring more than one line of business to the same relationship.',
      "It draws on the Group's own capability in international trade, commercial representation, sourcing, procurement and market access, which is what separates a hub from a directory.",
    ],
    blocks: [
      {
        icon: 'globe',
        heading: 'Global Trade Opportunities',
        body: 'Connecting companies with counterparts and opportunities across Egypt, the Middle East and international markets.',
      },
      {
        icon: 'compass',
        heading: 'Business Intelligence',
        body: 'Market and sector intelligence that turns an opportunity into a decision a company can act on.',
      },
      {
        icon: 'layers',
        heading: 'Sourcing & Procurement',
        body: 'Sourcing and procurement across raw and processed materials, products, machinery, services and systems.',
      },
      {
        icon: 'handshake',
        heading: 'Commercial Representation',
        body: 'Market access and commercial representation for companies entering a new territory or sector.',
      },
    ],
    highlights: [
      { icon: 'layers', label: 'Raw & Processed Materials' },
      { icon: 'tag', label: 'Products' },
      { icon: 'gear', label: 'Machinery' },
      { icon: 'briefcase', label: 'Services' },
      { icon: 'chip', label: 'Systems' },
    ],
  },

  {
    slug: 'ma3danha',
    name: 'MA3DANHA',
    tagline: 'Loyalty value, turned into real ownership',
    sector: 'Loyalty & Precious Metals',
    icon: 'bullion',
    url: null,
    urlLabel: null,
    // Transparent, so it sits straight on the card like every other mark.
    image: '/assets/images/ma3denha_f.png',
    imageWidth: 1280,
    imageHeight: 854,
    imageOnPlate: false,
    cardSummary:
      'A digital loyalty ecosystem designed to transform loyalty value into tangible precious-metal ownership.',
    intro:
      'A digital loyalty ecosystem that turns the value customers earn into something they actually own.',
    overview: [
      'Conventional loyalty gives a customer points: a balance that lives inside one programme, loses value over time and is worth nothing outside it. MA3DANHA is built on the opposite premise — that earned value should become an asset the customer holds.',
      'The platform converts loyalty value into tangible precious-metal ownership, so a reward keeps its worth after the programme that issued it has moved on.',
      'For the businesses issuing it, that changes what a loyalty programme is worth: a reward backed by a real asset is a reason to stay that a discount cannot match.',
    ],
    blocks: [
      {
        icon: 'coins',
        heading: 'Tangible Ownership',
        body: 'Loyalty value is converted into precious-metal ownership, not into points confined to a single programme.',
      },
      {
        icon: 'screen',
        heading: 'Digital by Design',
        body: 'A digital ecosystem, so earning, converting and holding all happen in one place.',
      },
      {
        icon: 'handshake',
        heading: 'For Issuing Businesses',
        body: 'Gives brands a loyalty proposition backed by a real asset rather than by a discount.',
      },
      {
        icon: 'shield',
        heading: 'Value That Holds',
        body: 'Precious metals are the store of value at the centre of the model, which is what keeps a reward worth something later.',
      },
    ],
    highlights: [
      { icon: 'diamond', label: 'Precious-Metal Backed' },
      { icon: 'spark', label: 'Loyalty Conversion' },
      { icon: 'screen', label: 'Digital Ecosystem' },
      { icon: 'users', label: 'Customer Retention' },
    ],
  },

  {
    slug: 'fish-link',
    name: 'FISH LINK',
    tagline: 'Modernizing the wholesale seafood trade',
    sector: 'Specialized Industries',
    icon: 'fish',
    url: 'https://www.fishlink.co/',
    urlLabel: 'fishlink.co',
    image: null,
    imageWidth: null,
    imageHeight: null,
    imageOnPlate: false,
    cardSummary:
      'A digital ecosystem designed to modernize and organize the wholesale seafood trade.',
    intro: 'A digital ecosystem built to modernize and organize the wholesale seafood trade.',
    overview: [
      "Wholesale seafood is traded fast, in volume, and largely on relationships and phone calls. That works until it does not: pricing is opaque, supply is hard to plan against, and a buyer's real information reaches only as far as whoever they happen to know.",
      'FISH LINK puts that trade on a digital footing — connecting the people who supply seafood with the people who buy it in volume, in one organized marketplace rather than across a scattering of private arrangements.',
      'It is the clearest example of what BWG means by a specialized-industry venture: a sector-focused platform built around a market that is large, essential, and still largely undigitized.',
    ],
    blocks: [
      {
        icon: 'fish',
        heading: 'Wholesale, Organized',
        body: 'Brings the wholesale seafood trade into one digital marketplace instead of a scattering of private arrangements.',
      },
      {
        icon: 'handshake',
        heading: 'Suppliers to Buyers',
        body: 'Connects suppliers directly with the traders, wholesalers and businesses buying in volume.',
      },
      {
        icon: 'screen',
        heading: 'A Digital Ecosystem',
        body: 'Listings, counterparts and trade in one place, rather than over calls and messages.',
      },
      {
        icon: 'growth',
        heading: 'A Market Being Modernized',
        body: 'A sector-focused venture built around a large, essential market that is still largely undigitized.',
      },
    ],
    highlights: [
      { icon: 'fish', label: 'Seafood Trade' },
      { icon: 'briefcase', label: 'Wholesale' },
      { icon: 'screen', label: 'Digital Marketplace' },
      { icon: 'globe', label: 'Live Platform' },
    ],
  },

  {
    slug: 'mosharek',
    name: 'MOSHAREK',
    tagline: 'Businesses, opportunities and participation',
    sector: 'Business Development',
    icon: 'users',
    url: null,
    urlLabel: null,
    image: null,
    imageWidth: null,
    imageHeight: null,
    imageOnPlate: false,
    cardSummary: 'A platform focused on connecting businesses, opportunities and participation.',
    intro:
      'A platform built around three things: businesses, the opportunities in front of them, and the means to take part.',
    overview: [
      'Most opportunities are missed not because a business could not deliver on them, but because it never saw them, or had no straightforward way in. MOSHAREK is aimed squarely at that gap.',
      'The platform connects businesses to opportunities and gives them a route to participate — the connecting step BWG performs across its ecosystem, built into a platform rather than delivered as a service.',
    ],
    blocks: [
      {
        icon: 'briefcase',
        heading: 'Businesses',
        body: 'Brings businesses into one place where they can be found, and can find each other.',
      },
      {
        icon: 'spark',
        heading: 'Opportunities',
        body: 'Surfaces the opportunities a business would otherwise never see.',
      },
      {
        icon: 'users',
        heading: 'Participation',
        body: 'Gives a business a clear route to take part, rather than only to be informed.',
      },
    ],
    highlights: [
      { icon: 'handshake', label: 'Connection' },
      { icon: 'spark', label: 'Opportunity' },
      { icon: 'users', label: 'Participation' },
    ],
  },

  {
    slug: 'madaaad',
    name: 'MADAAAD',
    tagline: 'A digital platform for the education industry',
    sector: 'Technology & Digital',
    icon: 'screen',
    url: 'https://www.madaaad.com/',
    urlLabel: 'madaaad.com',
    // Genuinely transparent, so it sits straight on the card with no plate.
    image: '/assets/images/app_mark.png',
    imageWidth: 1024,
    imageHeight: 1024,
    imageOnPlate: false,
    cardSummary:
      'A digital business platform developed to fulfill the needs of basic players in the education industry.',
    intro:
      "A digital business platform developed around the needs of the education industry's core players.",
    overview: [
      'Education runs on a supply chain most people never see: schools, centres, suppliers and service providers, all dependent on each other and most of them still transacting the long way round.',
      'MADAAAD is built for exactly those players. It is a digital business platform aimed at the basic needs of the education industry rather than at the classroom — the commercial side of education, put on a platform.',
      'It is live, and is one of two projects in the portfolio already open to the public.',
    ],
    blocks: [
      {
        icon: 'book',
        heading: 'Built for Education',
        body: 'Developed specifically around the needs of the education industry, not adapted from a general-purpose tool.',
      },
      {
        icon: 'users',
        heading: 'The Basic Players',
        body: 'Aimed at the players who make the sector work — the schools, centres, suppliers and providers behind it.',
      },
      {
        icon: 'screen',
        heading: 'A Digital Business Platform',
        body: 'The commercial side of education handled in one place, rather than the long way round.',
      },
      {
        icon: 'gear',
        heading: 'Live and Operating',
        body: 'One of two projects in the portfolio already open to the public.',
      },
    ],
    highlights: [
      { icon: 'book', label: 'Education Industry' },
      { icon: 'screen', label: 'Digital Platform' },
      { icon: 'briefcase', label: 'Business to Business' },
      { icon: 'globe', label: 'Live Platform' },
    ],
  },

  {
    slug: 'akibagold',
    name: 'AKIBAGOLD',
    tagline: 'Precious-metal ownership, made accessible',
    sector: 'Savings & Precious Metals',
    icon: 'jar',
    url: null,
    urlLabel: null,
    image: null,
    imageWidth: null,
    imageHeight: null,
    imageOnPlate: false,
    cardSummary:
      'A smart savings concept designed to make precious-metal ownership accessible through digital saving.',
    intro:
      'A smart savings concept that brings precious-metal ownership within reach through digital saving.',
    overview: [
      'Precious metals have always been the fallback store of value, and have always had the same barrier in front of them: you need a large sum before you can own any.',
      'AKIBAGOLD removes that barrier by making ownership something reached through saving rather than through a single purchase — digital saving, accumulated toward a holding in real metal.',
      'It shares its conviction with MA3DANHA, approached from the other side: MA3DANHA converts loyalty value into metal, AKIBAGOLD builds a holding out of ordinary saving.',
    ],
    blocks: [
      {
        icon: 'jar',
        heading: 'Saving, Not Buying',
        body: 'Ownership reached through accumulated digital saving rather than through one large purchase.',
      },
      {
        icon: 'users',
        heading: 'Accessible by Design',
        body: 'Built to put precious-metal ownership within reach of savers who could not previously access it.',
      },
      {
        icon: 'coins',
        heading: 'A Real Holding',
        body: 'Saving accumulates toward ownership of the metal itself, not toward a balance in a wallet.',
      },
      {
        icon: 'shield',
        heading: 'A Store of Value',
        body: 'Built on the asset people have always fallen back on when they wanted to keep what they had.',
      },
    ],
    highlights: [
      { icon: 'coins', label: 'Digital Saving' },
      { icon: 'diamond', label: 'Precious Metals' },
      { icon: 'users', label: 'Accessible Ownership' },
      { icon: 'shield', label: 'Store of Value' },
    ],
  },
];

export const findProject = (slug: string): Project | undefined =>
  PROJECTS.find((project) => project.slug === slug);
