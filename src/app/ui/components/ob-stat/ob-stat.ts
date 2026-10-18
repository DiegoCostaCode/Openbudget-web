import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ObMarker } from '../../primitives/ob-marker/ob-marker';
import { ObMoney, MoneyVariant } from '../../primitives/ob-money/ob-money';

@Component({
  selector: 'ob-stat',
  standalone: true,
  imports: [ObMarker, ObMoney],
  templateUrl: './ob-stat.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex items-center gap-2',
  },
})
export class ObStat {
  label = input.required<string>();
  amount = input<number | null | undefined>(null);
  customValue = input<string | null>(null);
  moneyVariant = input<MoneyVariant>('balance');
  isProjected = input(false);
  showMarker = input(false);
  markerVariant = input<'default' | 'neutral'>('default');
  emphasized = input(false);
}
