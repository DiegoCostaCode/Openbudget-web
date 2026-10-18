import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ObIconBox } from '../../primitives/ob-icon-box/ob-icon-box';
import { ObMoney } from '../../primitives/ob-money/ob-money';
import { TransactionDTO } from '../../../models/transactions';

@Component({
  selector: 'ob-transaction-item',
  standalone: true,
  imports: [ObIconBox, ObMoney],
  templateUrl: './ob-transaction-item.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'flex items-center justify-between gap-3 border border-line-faint bg-surface p-3 transition-colors hover:border-line-strong',
  },
})
export class ObTransactionItem {
  transaction = input.required<TransactionDTO>();

  protected isIncome = computed(() => this.transaction().type?.toUpperCase() === 'INCOME');
}
