import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, NgZone, PLATFORM_ID, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Which homepage section the reader is currently in, how far down the document
 * they are, and how to get to a section from anywhere in the site.
 *
 * Everything here is browser-only. The app prerenders to static HTML in Node,
 * which has no window, no document scroll and no IntersectionObserver, so every
 * entry point guards on the platform and the signals hold their static defaults
 * during prerender: no active section, not scrolled, zero progress. That is the
 * correct first paint anyway — the page starts at the top.
 */
@Injectable({ providedIn: 'root' })
export class ScrollSpyService {
  private readonly router = inject(Router);
  private readonly zone = inject(NgZone);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /** The section currently in the upper third, or null when none is. */
  readonly activeId = signal<string | null>(null);

  /** True once the document has scrolled past 24px — the navbar's glass state. */
  readonly scrolled = signal(false);

  /** Document scroll position, 0 → 1. Drives the navbar's progress hairline. */
  readonly progress = signal(0);

  private observer: IntersectionObserver | null = null;
  private detachScroll: (() => void) | null = null;

  /** Ids currently intersecting the observer's band, unordered. */
  private readonly intersecting = new Set<string>();

  /** Document order, so ties resolve to the section nearest the top. */
  private ordered: readonly string[] = [];

  private frameQueued = false;

  /**
   * Start watching the given section ids. Call from the component that owns the
   * sections — HomePage — so the elements are guaranteed to exist, and call
   * stop() when it is destroyed.
   *
   * rootMargin shrinks the viewport to the band between 20% and 40% from the
   * top, so a link activates as its section arrives at the upper third rather
   * than when it first peeks in at the bottom.
   */
  observe(ids: readonly string[]): void {
    if (!this.isBrowser) {
      return;
    }

    this.stop();
    this.ordered = ids;

    // The observer fires on every scroll frame that crosses a boundary. Running
    // it outside Angular keeps those callbacks off the change-detection path;
    // only a genuine change to the active id is worth re-rendering for.
    this.zone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const { id } = entry.target;
            if (entry.isIntersecting) {
              this.intersecting.add(id);
            } else {
              this.intersecting.delete(id);
            }
          }

          // Between two sections nothing intersects. Hold the last active id
          // rather than flickering to null.
          const next = this.ordered.find((id) => this.intersecting.has(id));
          if (next !== undefined && next !== this.activeId()) {
            this.zone.run(() => this.activeId.set(next));
          }
        },
        { rootMargin: '-20% 0px -60% 0px', threshold: 0 },
      );

      for (const id of ids) {
        const element = this.document.getElementById(id);
        if (element) {
          this.observer.observe(element);
        }
      }
    });
  }

  /**
   * Start tracking document scroll position.
   *
   * Deliberately separate from observe(): the navbar's glass state and progress
   * hairline apply on every route, but only the homepage has sections to spy on.
   * Tying the two together would leave the bar transparent and the progress line
   * frozen on /leadership. Idempotent — the navbar calls it once and it outlives
   * every page.
   */
  trackScroll(): void {
    if (!this.isBrowser || this.detachScroll) {
      return;
    }
    this.zone.runOutsideAngular(() => this.attachScroll());
  }

  /**
   * Stop spying on sections. Leaves scroll tracking alone — see trackScroll.
   */
  stop(): void {
    this.observer?.disconnect();
    this.observer = null;
    this.intersecting.clear();
    this.ordered = [];
    this.activeId.set(null);
  }

  /**
   * Scroll to a homepage section from anywhere in the site.
   *
   * From another route this navigates home first, then waits for the section to
   * actually exist before scrolling — a router navigation resolving is not the
   * same as the homepage having painted, and scrolling to an element that is not
   * in the DOM yet silently does nothing.
   */
  goToSection(id: string): void {
    if (!this.isBrowser) {
      return;
    }

    const onHome = this.router.url.split(/[?#]/)[0] === '/';
    if (onHome) {
      this.scrollWhenReady(id);
      return;
    }

    void this.router.navigateByUrl('/').then((ok) => {
      if (ok) {
        this.scrollWhenReady(id);
      }
    });
  }

  /**
   * Poll for the element across animation frames, then scroll.
   *
   * This covers both cases with one mechanism: on the homepage the element is
   * already there and the first attempt succeeds, and after a navigation it
   * appears within a frame or two. Capped so a bad id cannot loop forever.
   */
  private scrollWhenReady(id: string, attempts = 30): void {
    const element = this.document.getElementById(id);

    if (element) {
      const reduce = this.prefersReducedMotion();
      // html { scroll-padding-top } keeps the section clear of the fixed navbar,
      // so this does not need to offset by the bar height itself.
      element.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      return;
    }

    if (attempts > 0) {
      requestAnimationFrame(() => this.scrollWhenReady(id, attempts - 1));
    }
  }

  private prefersReducedMotion(): boolean {
    const view = this.document.defaultView;
    return view?.matchMedia('(prefers-reduced-motion: reduce)').matches ?? false;
  }

  /**
   * Passive scroll listener, coalesced to one read per animation frame.
   *
   * Reading scrollY and scrollHeight in the handler itself would force layout on
   * every scroll event; deferring to rAF batches it into the frame that is going
   * to paint anyway.
   */
  private attachScroll(): void {
    const view = this.document.defaultView;
    if (!view) {
      return;
    }

    const onScroll = () => {
      if (this.frameQueued) {
        return;
      }
      this.frameQueued = true;
      requestAnimationFrame(() => {
        this.frameQueued = false;
        this.readScroll(view);
      });
    };

    view.addEventListener('scroll', onScroll, { passive: true });
    view.addEventListener('resize', onScroll, { passive: true });
    this.detachScroll = () => {
      view.removeEventListener('scroll', onScroll);
      view.removeEventListener('resize', onScroll);
    };

    this.readScroll(view);
  }

  private readScroll(view: Window): void {
    const top = view.scrollY;
    const scrollable = this.document.documentElement.scrollHeight - view.innerHeight;
    const next = scrollable > 0 ? Math.min(1, Math.max(0, top / scrollable)) : 0;
    const isScrolled = top > 24;

    // Two writes, one zone entry, and only when something actually moved.
    // Progress is rounded to the nearest thousandth: the hairline cannot render
    // a finer difference than that, and it stops sub-pixel scroll jitter from
    // re-rendering the navbar on every frame.
    const rounded = Math.round(next * 1000) / 1000;
    if (rounded === this.progress() && isScrolled === this.scrolled()) {
      return;
    }

    this.zone.run(() => {
      this.progress.set(rounded);
      this.scrolled.set(isScrolled);
    });
  }
}
