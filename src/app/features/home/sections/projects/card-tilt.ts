import { isPlatformBrowser } from '@angular/common';
import {
  DestroyRef,
  Directive,
  ElementRef,
  NgZone,
  PLATFORM_ID,
  afterNextRender,
  inject,
} from '@angular/core';

/**
 * Pointer-tracked tilt for a card.
 *
 * The directive does one job: turn the pointer's position into four custom
 * properties on the host and let CSS decide what to do with them.
 *
 *   --px, --py  the pointer's offset from the centre, -1 to 1
 *   --mx, --my  the pointer's position as a percentage, for the light sweep
 *
 * Keeping the numbers here and the look in the stylesheet is what lets the
 * effect be dialled down per breakpoint without touching this file: the CSS
 * multiplies --px and --py by its own --tilt-max, which is 6deg on a desktop,
 * 3deg on a tablet and 0 where there is no pointer at all.
 *
 * Nothing here runs inside Angular. Listeners are bound outside the zone and
 * write to the DOM directly, so moving a pointer across a card never triggers
 * change detection — six cards streaming pointermove events through the
 * scheduler would cost far more than the effect is worth.
 */
@Directive({
  selector: '[bwgCardTilt]',
})
export class CardTilt {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private frame = 0;
  private pending: { px: number; py: number; mx: number; my: number } | null = null;

  /**
   * The card's box, measured once when the pointer arrives.
   *
   * Read on enter rather than on every move for two reasons: it avoids forcing
   * layout on every frame, and getBoundingClientRect reports the *transformed*
   * box — measuring mid-tilt would feed the card's own rotation back into the
   * next reading and make it drift.
   */
  private box: DOMRect | null = null;

  constructor() {
    // afterNextRender never runs during prerender, so the server never reaches
    // any of the DOM below.
    afterNextRender(() => this.attach());
  }

  private attach(): void {
    const element = this.host.nativeElement;
    const view = element.ownerDocument?.defaultView;

    if (!this.isBrowser || !view) {
      return;
    }

    const finePointer = view.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = view.matchMedia('(prefers-reduced-motion: reduce)');

    this.zone.runOutsideAngular(() => {
      let bound = false;
      let onScreen = false;

      const onEnter = (event: PointerEvent) => {
        this.box = element.getBoundingClientRect();
        this.track(event);
        element.classList.add('is-tilting');
      };

      const onMove = (event: PointerEvent) => this.track(event);

      const onLeave = () => {
        this.cancel();
        this.box = null;
        element.classList.remove('is-tilting');
        // Back to centre. The CSS transition carries it home rather than
        // snapping, because the properties resolve into a transform that is
        // itself transitioned.
        for (const name of ['--px', '--py', '--mx', '--my']) {
          element.style.removeProperty(name);
        }
      };

      const bind = () => {
        element.addEventListener('pointerenter', onEnter);
        element.addEventListener('pointermove', onMove, { passive: true });
        element.addEventListener('pointerleave', onLeave);
        bound = true;
      };

      const unbind = () => {
        element.removeEventListener('pointerenter', onEnter);
        element.removeEventListener('pointermove', onMove);
        element.removeEventListener('pointerleave', onLeave);
        onLeave();
        bound = false;
      };

      /**
       * Bind only where a pointer can hover, motion is welcome, and the card is
       * actually on screen — and re-decide whenever any of the three changes: a
       * reader switching on reduced motion, a hybrid device swapping between
       * touch and trackpad, or the section scrolling out of view.
       */
      const sync = () => {
        const wanted = onScreen && finePointer.matches && !reducedMotion.matches;
        if (wanted && !bound) {
          bind();
        } else if (!wanted && bound) {
          unbind();
        }
      };

      finePointer.addEventListener('change', sync);
      reducedMotion.addEventListener('change', sync);

      // A card that has scrolled away holds no listeners at all. Six cards each
      // keeping a live pointermove handler for a section nobody is looking at is
      // work for nothing.
      const viewport = new IntersectionObserver(
        ([entry]) => {
          onScreen = entry.isIntersecting;
          sync();
        },
        { rootMargin: '200px' },
      );
      viewport.observe(element);

      this.destroyRef.onDestroy(() => {
        viewport.disconnect();
        finePointer.removeEventListener('change', sync);
        reducedMotion.removeEventListener('change', sync);
        if (bound) {
          unbind();
        }
        this.cancel();
      });
    });
  }

  /** Coalesce to one write per frame, however fast the pointer moves. */
  private track(event: PointerEvent): void {
    const box = this.box;
    if (!box || box.width === 0 || box.height === 0) {
      return;
    }

    const x = (event.clientX - box.left) / box.width;
    const y = (event.clientY - box.top) / box.height;

    this.pending = {
      // -1 at the leading edge, +1 at the trailing edge.
      px: Math.round((x * 2 - 1) * 1000) / 1000,
      py: Math.round((y * 2 - 1) * 1000) / 1000,
      mx: Math.round(x * 1000) / 10,
      my: Math.round(y * 1000) / 10,
    };

    if (this.frame) {
      return;
    }

    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      const next = this.pending;
      if (!next) {
        return;
      }
      const style = this.host.nativeElement.style;
      style.setProperty('--px', String(next.px));
      style.setProperty('--py', String(next.py));
      style.setProperty('--mx', `${next.mx}%`);
      style.setProperty('--my', `${next.my}%`);
    });
  }

  private cancel(): void {
    if (this.frame) {
      cancelAnimationFrame(this.frame);
      this.frame = 0;
    }
    this.pending = null;
  }
}
