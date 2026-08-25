import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Navbar } from './layout/navbar/navbar';

/**
 * Application shell.
 *
 * It owns the page's three landmarks and nothing else: the skip link, the single
 * <header> (rendered by Navbar), and the single <main>. Everything visual lives
 * in a route component or a section component.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
