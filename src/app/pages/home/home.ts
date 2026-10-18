import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Transactions } from '../../services/transactions';
import { DaySnapshotDTO } from '../../models/transactions';
import { ObAppHeader } from '../../ui/patterns/ob-app-header/ob-app-header';
import { ObToolbar } from '../../ui/patterns/ob-toolbar/ob-toolbar';
import { ObInsightsPanel } from '../../ui/patterns/ob-insights-panel/ob-insights-panel';
import { ObLedger } from '../../ui/patterns/ob-ledger/ob-ledger';
import { ObButton } from '../../ui/primitives/ob-button/ob-button';
import { TransactionForm } from '../../components/transaction-form/transaction-form';
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
  activePeriod = signal<string>('12M');

  // Modal de Transação
  isModalOpen = signal(false);
  modalDate = signal<string | null>(null);
  modalType = signal<'INCOME' | 'EXPENSE'>('EXPENSE');

  private todayStr = this.getTodayString();

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

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);
    this.transactionsService.generateView().subscribe({
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

  openNewTransaction(type: 'INCOME' | 'EXPENSE' = 'EXPENSE', date: string | null = null): void {
    this.modalType.set(type);
    this.modalDate.set(date || this.todayStr);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  onTransactionSaved(): void {
    this.closeModal();
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
