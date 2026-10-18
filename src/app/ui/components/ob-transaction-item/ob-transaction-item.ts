import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
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
    role: 'button',
    tabindex: '0',
    class:
      'flex items-center justify-between gap-3 border border-line-faint bg-surface p-3 transition-colors hover:border-line-strong cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg',
    '(click)': 'onSelect()',
    '(keydown.enter)': 'onSelect()',
    '(keydown.space)': 'onSelect($event)',
  },
})
export class ObTransactionItem {
  transaction = input.required<TransactionDTO>();
  selected = output<TransactionDTO>();

  protected isIncome = computed(() => this.transaction().type?.toUpperCase() === 'INCOME');

  onSelect(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.selected.emit(this.transaction());
  }
}
