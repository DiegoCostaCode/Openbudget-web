import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ob-badge',
  standalone: true,
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-flex items-center border border-line-strong bg-tint-strong px-1.5 py-0.5 text-micro font-bold uppercase text-fg',
  },
})
export class ObBadge {}
