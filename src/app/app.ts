import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ObInvertedCursor } from './ui/behaviors/ob-inverted-cursor/ob-inverted-cursor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ObInvertedCursor],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly title = signal('openbudget-app');
}
