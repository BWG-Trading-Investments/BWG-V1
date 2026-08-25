/**
 * Site navigation — the single source of truth.
 *
 * The desktop bar and the mobile panel both render from NAV_ITEMS; neither holds
 * its own copy of the list. Adding, reordering or renaming a link here changes
 * both at once, and the `01`–`06` numerals in the mobile panel come from the
 * array index rather than being written out by hand.
 */

/**
 * How a link resolves.
 *
 * `anchor` — a section on the homepage. Clicking it scrolls, and from another
 *            route it navigates home first. See ScrollSpyService.goToSection.
 * `route`  — a real router path with its own page.
 */
export type NavKind = 'anchor' | 'route';

export interface NavItem {
  readonly label: string;
  readonly kind: NavKind;
  /** A section id for `anchor`, an absolute router path for `route`. */
  readonly target: string;
}

/**
 * The eight primary links, in bar order.
 *
 * Home and Contact us were deliberately absent at first, on the reasoning that
 * the logo and the CTA already covered them. That call has been reversed — both
 * are explicit links now, and the bar carries eight.
 *
 * The index of each entry is load-bearing: the mobile panel numbers its links
 * from it, so this array's order is what produces 01–08.
 */
export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Home', kind: 'anchor', target: 'hero' },
  { label: 'About BWG', kind: 'anchor', target: 'about' },
  { label: 'Our Ecosystem', kind: 'anchor', target: 'ecosystem' },
  { label: 'Our Projects', kind: 'anchor', target: 'projects' },
  // The one real route. Uses this repo's existing path name — `leadership`,
  // not `leaders`; the nav config bends to the route, not the reverse.
  { label: 'Our Leaders', kind: 'route', target: '/leadership' },
  { label: 'Partnerships', kind: 'anchor', target: 'partnerships' },
  { label: 'Invest', kind: 'anchor', target: 'invest' },
  { label: 'Contact us', kind: 'anchor', target: 'contact' },
];

/**
 * The single call to action, rendered as a button rather than a link.
 *
 * It shares a destination with the Contact us link above. That is intentional —
 * one is navigation, one is an affordance — but only the link is allowed to
 * carry aria-current, so assistive technology is not told about the same
 * destination twice. See Navbar.currentFor.
 */
export const NAV_CTA: NavItem = {
  label: 'Get in Touch',
  kind: 'anchor',
  target: 'contact',
};

/**
 * Every homepage section, in scroll order.
 *
 * HomePage renders these ids and hands the list to the scroll-spy, which relies
 * on the order being document order when more than one section sits inside the
 * observer's active band.
 */
export const SECTION_IDS = [
  'hero',
  'statement',
  'ecosystem',
  'about',
  'projects',
  'why',
  'partnerships',
  'invest',
  'contact',
] as const;

export type SectionId = (typeof SECTION_IDS)[number];
