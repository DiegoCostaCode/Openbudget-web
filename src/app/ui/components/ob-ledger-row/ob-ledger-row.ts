import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { DaySnapshotDTO } from '../../../models/transactions';
import { ObDate } from '../../primitives/ob-date/ob-date';
import { ObMoney } from '../../primitives/ob-money/ob-money';
import { ObMarker } from '../../primitives/ob-marker/ob-marker';

@Component({
  selector: 'ob-ledger-row',
  standalone: true,
  imports: [ObDate, ObMoney, ObMarker],
  templateUrl: './ob-ledger-row.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'button',
    tabindex: '0',
    '[attr.aria-expanded]': 'isExpanded()',
    '[attr.data-interactive]': 'true',
    '[class]': 'hostClasses()',
    '(click)': 'toggle.emit()',
    '(keydown.enter)': 'toggle.emit(); $event.preventDefault()',
    '(keydown.space)': 'toggle.emit(); $event.preventDefault()',
  },
})
export class ObLedgerRow {
  day = input.required<DaySnapshotDTO>();
  isToday = input(false);
  isFuture = input(false);
  isExpanded = input(false);

  toggle = output<void>();

  protected txCount = computed(() => this.day().transactions?.length ?? 0);

  protected incomeTotal = computed(() => {
    const txs = this.day().transactions || [];
    return txs
      .filter((t) => t.type?.toUpperCase() === 'INCOME')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
  });

  protected expenseTotal = computed(() => {
    const txs = this.day().transactions || [];
    return txs
      .filter((t) => t.type?.toUpperCase() === 'EXPENSE')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
  });

  protected netDelta = computed(() => this.incomeTotal() - this.expenseTotal());

  protected hostClasses = computed(() => {
    const base =
      'flex items-center justify-between border p-3 md:grid md:grid-cols-12 md:border-0 md:border-l-4 md:py-3 md:pl-5 md:pr-6 text-xs cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg ';
    if (this.isToday()) {
      return (
        base +
        'border-line-strong border-l-4 border-l-accent bg-tint-fill md:bg-tint-selected md:relative md:z-10'
      );
    }
    return (
      base +
      'border-line-faint bg-surface hover:border-line-strong md:border-l-transparent md:bg-transparent md:hover:bg-tint-hover'
    );
  });
}
