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
  ViewChildren 
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

  @ViewChild('tableContainer')
  tableContainer!: ElementRef<HTMLDivElement>;

  @ViewChildren('dayRow')
  dayRows!: QueryList<ElementRef<HTMLDivElement>>;

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

    this.dayRows.changes.subscribe(() => {

        this.scrollbar.update();

        this.scrollToTodayRecords();

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

  ngOnDestroy() {
    this.scrollbar?.destroy();
  }
}

