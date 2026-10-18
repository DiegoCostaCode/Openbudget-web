import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { ObPanel } from '../../components/ob-panel/ob-panel';
import { ObStat } from '../../components/ob-stat/ob-stat';
import { ObMetricBlock } from '../../components/ob-metric-block/ob-metric-block';
import { ObMoney } from '../../primitives/ob-money/ob-money';
import { ObButton } from '../../primitives/ob-button/ob-button';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'ob-insights-panel',
  standalone: true,
  imports: [ObPanel, ObStat, ObMetricBlock, ObMoney, ObButton, LucideAngularModule],
  templateUrl: './ob-insights-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObInsightsPanel {
  currentBalance = input<number>(0);
  totalIncome = input<number>(0);
  totalExpense = input<number>(0);
  minProjectedBalance = input<number>(0);
  statusText = input<string>('ESTÁVEL');

  createIncome = output<void>();
  createExpense = output<void>();

  isExpanded = signal(false);

  protected isMinAlert = computed(() => this.minProjectedBalance() < 0);

  toggle(): void {
    this.isExpanded.update((v) => !v);
  }
}
