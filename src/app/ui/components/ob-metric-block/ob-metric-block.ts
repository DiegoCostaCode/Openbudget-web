import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ObMoney, MoneyVariant } from '../../primitives/ob-money/ob-money';

@Component({
  selector: 'ob-metric-block',
  standalone: true,
  imports: [ObMoney],
  templateUrl: './ob-metric-block.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block px-6 py-4',
  },
})
export class ObMetricBlock {
  label = input.required<string>();
  amount = input<number | null | undefined>(null);
  variant = input<MoneyVariant>('balance');
  isHero = input(false);
  isProjected = input(false);
  meta = input<string | null>(null);
  metaAlert = input(false);
}
