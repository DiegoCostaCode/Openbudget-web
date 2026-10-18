import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Transactions } from '../../services/transactions';
import { DaySnapshotDTO, TransactionDTO } from '../../models/transactions';
import { ObAppHeader } from '../../ui/patterns/ob-app-header/ob-app-header';
import { ObToolbar } from '../../ui/patterns/ob-toolbar/ob-toolbar';
import { ObInsightsPanel } from '../../ui/patterns/ob-insights-panel/ob-insights-panel';
import { ObLedger } from '../../ui/patterns/ob-ledger/ob-ledger';
import { ObButton } from '../../ui/primitives/ob-button/ob-button';
import { TransactionForm } from '../../components/transaction-form/transaction-form';
import { RecurrenceModal } from '../../components/recurrence-modal/recurrence-modal';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ObAppHeader,
    ObToolbar,
    ObInsightsPanel,
    ObLedger,
    ObButton,
    TransactionForm,
    RecurrenceModal,
    LucideAngularModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home implements OnInit {
  private transactionsService = inject(Transactions);

  @ViewChild(ObLedger)
  ledgerComponent?: ObLedger;

  days = signal<DaySnapshotDTO[]>([]);
  isLoading = signal(true);
  activePeriod = signal<string>('30D');

  // Modal de Transação
  isModalOpen = signal(false);
  modalDate = signal<string | null>(null);
  modalType = signal<'INCOME' | 'EXPENSE'>('EXPENSE');
  modalEntryMode = signal<'SINGLE' | 'RECURRING'>('SINGLE');
  editingTransaction = signal<TransactionDTO | null>(null);

  // Modal de Recorrências
  isRecurrenceModalOpen = signal(false);

  private todayStr = this.getTodayString();

  constructor() {
    effect(() => {
      // Reage automaticamente quando activePeriod() mudar
      this.activePeriod();
      this.loadData();
    });
  }

  protected currentBalance = computed(() => {
    const list = this.days();
    if (!list || list.length === 0) return 0;

    const todayDay = list.find((d) => d.date === this.todayStr);
    if (todayDay) return todayDay.balance;

    // Caso não ache exatamente hoje, pega o último <= hoje
    const pastDays = list.filter((d) => d.date <= this.todayStr);
    if (pastDays.length > 0) {
      return pastDays[pastDays.length - 1].balance;
    }

    return list[0].balance;
  });

  protected totalIncome = computed(() => {
    return this.days().reduce((sum, day) => {
      const dayIncome = (day.transactions || [])
        .filter((t) => t.type?.toUpperCase() === 'INCOME')
        .reduce((s, t) => s + (t.amount || 0), 0);
      return sum + dayIncome;
    }, 0);
  });

  protected totalExpense = computed(() => {
    return this.days().reduce((sum, day) => {
      const dayExpense = (day.transactions || [])
        .filter((t) => t.type?.toUpperCase() === 'EXPENSE')
        .reduce((s, t) => s + (t.amount || 0), 0);
      return sum + dayExpense;
    }, 0);
  });

  protected minProjectedBalance = computed(() => {
    const list = this.days();
    if (!list || list.length === 0) return 0;
    const futureDays = list.filter((d) => d.date >= this.todayStr);
    if (futureDays.length === 0) return this.currentBalance();

    return futureDays.reduce(
      (min, d) => (d.balance < min ? d.balance : min),
      futureDays[0].balance
    );
  });

  protected statusText = computed(() => {
    return this.minProjectedBalance() < 0 ? 'ALERTA // DÉFICIT' : 'ESTÁVEL';
  });

  ngOnInit(): void {}

  private getDaysForPeriod(period: string): number {
    switch (period) {
      case '30D':
        return 30;
      case '90D':
        return 90;
      case '12M':
        return 365;
      default:
        return 30;
    }
  }

  loadData(): void {
    const days = this.getDaysForPeriod(this.activePeriod());
    this.isLoading.set(true);
    this.transactionsService.generateView(days).subscribe({
      next: (projection) => {
        this.days.set(projection?.days || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Falha ao carregar projeção:', err);
        this.isLoading.set(false);
      },
    });
  }

  scrollToToday(): void {
    this.ledgerComponent?.scrollToToday();
  }

  openNewTransaction(
    type: 'INCOME' | 'EXPENSE' = 'EXPENSE',
    date: string | null = null,
    entryMode: 'SINGLE' | 'RECURRING' = 'SINGLE'
  ): void {
    this.editingTransaction.set(null);
    this.modalType.set(type);
    this.modalDate.set(date || this.todayStr);
    this.modalEntryMode.set(entryMode);
    this.isModalOpen.set(true);
  }

  openEditTransaction(tx: TransactionDTO): void {
    this.editingTransaction.set(tx);
    this.modalType.set((tx.type?.toUpperCase() as 'INCOME' | 'EXPENSE') || 'EXPENSE');
    this.modalDate.set(tx.transactionDate);
    this.modalEntryMode.set('SINGLE');
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.editingTransaction.set(null);
  }

  onTransactionSaved(): void {
    this.closeModal();
    this.loadData();
  }

  onTransactionDeleted(): void {
    this.closeModal();
    this.loadData();
  }

  openRecurrenceModal(): void {
    this.isRecurrenceModalOpen.set(true);
  }

  closeRecurrenceModal(): void {
    this.isRecurrenceModalOpen.set(false);
  }

  onNewRecurrenceFromModal(): void {
    this.closeRecurrenceModal();
    this.openNewTransaction('EXPENSE', this.todayStr, 'RECURRING');
  }

  onRecurrenceChanged(): void {
    this.loadData();
  }

  private getTodayString(): string {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
}
