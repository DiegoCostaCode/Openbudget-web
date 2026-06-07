import { 
  Component,
  signal,
  inject,
  ChangeDetectionStrategy,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  QueryList,
  ViewChildren,
  OnInit
} from '@angular/core';
import { Transactions } from '../../services/transactions';
import { ProjectionSnapshotDTO, TransactionDTO } from '../../models/transactions';
import { CurrencyPipe, formatDate } from '@angular/common';
import Scrollbar from 'smooth-scrollbar';

@Component({
  selector: 'app-tabela-registros',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './tabela-registros.html',
  styleUrl: './tabela-registros.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabelaRegistros implements AfterViewInit, OnDestroy {
  
  private transactions = inject(Transactions);

  scrollbar!: Scrollbar;

  transactionsRecord = signal<ProjectionSnapshotDTO>({
    days: []
  });

  isViewAtToday = signal<boolean>(true);

  @ViewChild('tableContainer')
  tableContainer!: ElementRef<HTMLDivElement>;

  @ViewChildren('dayRow')
  dayRows!: QueryList<ElementRef<HTMLDivElement>>;

  isViewingToday = signal(true)
  expandedDate = signal<string | null>(null);

  ngOnInit(): void {
    this.getProjection();
  }

  ngAfterViewInit(): void {
    this.scrollbar = Scrollbar.init(
      this.tableContainer.nativeElement,
      {
        damping: 0.08,
        alwaysShowTracks: true
      }
    );

    this.scrollbar.addListener(() => {
      this.checkIfViewIsAtToday();
    });

    this.dayRows.changes.subscribe(() => {
        this.scrollbar.update();
        this.scrollToTodayRecords();
        this.checkIfViewIsAtToday();
    });
  }

  getProjection(): void {
    this.transactions.generateView().subscribe({

      next: (projection) => {
        this.transactionsRecord.set(projection);
      },

      error: (err) => {
        console.error(err);
      }

    });
  }

  parseDate(date: String) : String {
    return formatDate(date.toString(),"dd/MM/yyyy","en-US");
  }

  sumTransactions(transactions: TransactionDTO[]) : number{
    return transactions.reduce((totalAmount, transaction) => totalAmount + transaction.amount, 0)
  }

  sumIncomeTransactions(transactions: TransactionDTO[]): number {
    return transactions
      .filter(transaction => transaction.type === 'INCOME')
      .reduce((totalAmount, transaction) => totalAmount + transaction.amount, 0)
  }

  sumExpenseTransactions(transactions: TransactionDTO[]): number {
    return transactions
      .filter(transaction => transaction.type === 'EXPENSE')
      .reduce((totalAmount, transaction) => totalAmount + transaction.amount, 0)
  }

  isToday(date: string): boolean {
    return date === formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
  }

  checkIfViewIsAtToday(): void {
    const todayString = formatDate(
      new Date(),
      'yyyy-MM-dd',
      'en-US'
    );

    const todayRow = this.dayRows.find(
      row => row.nativeElement.id === `day-${todayString}`
    );

    if (!todayRow) {
      this.isViewingToday.set(false);
      console.log(this.isViewingToday())
      return;
    }

    const containerRect =
      this.tableContainer.nativeElement.getBoundingClientRect();

    const elementRect =
      todayRow.nativeElement.getBoundingClientRect();

    const isVisible =
      elementRect.bottom > containerRect.top &&
      elementRect.top < containerRect.bottom;

    this.isViewingToday.set(isVisible);
    console.log(this.isViewingToday())
}

  scrollToTodayRecords(): void {
    const todayString = formatDate(
      new Date(),
      'yyyy-MM-dd',
      'en-US'
    );

    const todayRow = this.dayRows.find(
      row =>
        row.nativeElement.id === `day-${todayString}`
    );

    if (!todayRow) {
      return;
    }

    const element = todayRow.nativeElement;

    const offsetTop = element.offsetTop;

    const containerHeight =
      this.tableContainer.nativeElement.clientHeight;

    const elementHeight =
      element.clientHeight;

    const targetPosition =
      offsetTop -
      (containerHeight / 2) +
      (elementHeight / 2);

    this.scrollbar.scrollTo(
      0,
      Math.max(0, targetPosition),
      800
    );
  }

  toggleDay(date: string): void {
    this.expandedDate.update(
      current => current === date ? null : date
    )
  }

  ngOnDestroy() {
    this.scrollbar?.destroy();
  }
}

