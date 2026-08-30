import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';

export type Theme = 'dark' | 'light';

/** How long the cross-fade between themes runs. Matches --bwg-dur-slow. */
const SWITCH_MS = 420;

/**
 * The browser-chrome colour per theme — the Android address bar, the title bar
 * of an installed window.
 *
 * These mirror --bwg-ink in _tokens.scss and are the one colour in the app
 * written twice. It cannot be read from the token: Angular inlines a critical
 * subset of the CSS and defers the real stylesheet behind media="print", so at
 * bootstrap getPropertyValue('--bwg-ink') returns an empty string as often as not,
 * and the meta would keep whichever value it was born with. _tokens.scss remains
 * the source of truth; if --bwg-ink changes there, change it here too.
 */
const THEME_COLORS: Record<Theme, string> = {
  dark: '#07080B',
  light: '#F7F4EE',
};

/**
 * Which palette the site is wearing.
 *
 * The theme is one attribute on <html>; every colour follows from the token
 * block keyed off it, so nothing else in the app has to know a theme exists.
 * Components that cannot read CSS — the WebGL globe is the only one — read this
 * signal instead.
 *
 * Light is the default, and unconditionally so: index.html ships
 * data-theme="light" on <html> itself rather than computing it here or in a
 * script. The default is therefore already true of the static HTML, holds with
 * JavaScript disabled, and cannot flash. This service only handles changing it.
 *
 * The system preference is deliberately not consulted. A reader on a dark
 * desktop still opens the site in light, because the default is a brand
 * decision rather than an environment one; dark remains one click away.
 *
 * The choice is deliberately not persisted either: this project stores nothing
 * in localStorage or sessionStorage, so a reload returns to light.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly current = signal<Theme>(this.initial());

  /** The active theme. Read it; call toggle() or set() to change it. */
  readonly theme = this.current.asReadonly();

  private switchTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    if (this.isBrowser) {
      // index.html already carries the attribute; this keeps the signal, the DOM
      // and the chrome colour in step for anything that changes it later.
      this.apply(this.current(), false);
    }
  }

  toggle(): void {
    this.set(this.current() === 'dark' ? 'light' : 'dark');
  }

  set(theme: Theme): void {
    if (theme === this.current()) {
      return;
    }
    this.current.set(theme);
    this.apply(theme, true);
  }

  /**
   * Read what the document is already wearing, so the signal starts in step with
   * the markup instead of assuming a theme and then flipping it.
   *
   * Falls back to light rather than to the system preference — on the server,
   * where there is no document to read, and in the ordinary case alike.
   */
  private initial(): Theme {
    const attribute = this.isBrowser
      ? this.document.documentElement.dataset['theme']
      : undefined;

    return attribute === 'dark' ? 'dark' : 'light';
  }

  /**
   * Write the attribute, and cross-fade the change.
   *
   * The transition is added for the length of the switch and then removed rather
   * than left on permanently: a standing transition on every colour in the
   * document would drag on every hover and every reveal in the site.
   */
  private apply(theme: Theme, animate: boolean): void {
    const root = this.document.documentElement;
    root.dataset['theme'] = theme;

    const meta = this.document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (meta) {
      meta.content = THEME_COLORS[theme];
    }

    if (!animate) {
      return;
    }

    root.classList.add('is-theme-switching');

    if (this.switchTimer) {
      clearTimeout(this.switchTimer);
    }
    this.switchTimer = setTimeout(() => {
      root.classList.remove('is-theme-switching');
      this.switchTimer = null;
    }, SWITCH_MS);
  }
}
