import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { DaySnapshotDTO, TransactionDTO } from '../../../models/transactions';
import { ObTransactionItem } from '../../components/ob-transaction-item/ob-transaction-item';
import { ObButton } from '../../primitives/ob-button/ob-button';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'ob-day-details',
  standalone: true,
  imports: [ObTransactionItem, ObButton, LucideAngularModule],
  templateUrl: './ob-day-details.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block border-y border-line bg-surface-sunken px-6 py-4 w-full',
  },
})
export class ObDayDetails {
  day = input.required<DaySnapshotDTO>();

  addTransaction = output<string>();
  editTransaction = output<TransactionDTO>();

  protected txCount = computed(() => this.day().transactions?.length ?? 0);

  protected formattedDate = computed(() => {
    const raw = this.day().date;
    if (!raw) return '';
    const parts = raw.split('-');
    if (parts.length < 3) return raw;
    const yyyy = parts[0];
    const mm = parts[1];
    const dd = parts[2];
    return `${dd}.${mm}.${yyyy}`;
  });
}
