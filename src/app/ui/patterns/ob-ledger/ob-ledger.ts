import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  computed,
  input,
  output,
  signal,
  AfterViewInit,
} from '@angular/core';
import { DaySnapshotDTO } from '../../../models/transactions';
import { ObPanel } from '../../components/ob-panel/ob-panel';
import { ObPanelBar } from '../../components/ob-panel-bar/ob-panel-bar';
import { ObLedgerRow } from '../../components/ob-ledger-row/ob-ledger-row';
import { ObDayDetails } from '../ob-day-details/ob-day-details';
import Scrollbar from 'smooth-scrollbar';

@Component({
  selector: 'ob-ledger',
  standalone: true,
  imports: [ObPanel, ObPanelBar, ObLedgerRow, ObDayDetails],
  templateUrl: './ob-ledger.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col flex-1 min-h-0',
  },
})
export class ObLedger implements OnInit, AfterViewInit, OnDestroy {
  days = input<DaySnapshotDTO[]>([]);
  period = input<string>('12M');

  addTransaction = output<string>();

  @ViewChild('scrollContainer')
  scrollContainer!: ElementRef<HTMLDivElement>;

  @ViewChildren('dayRowElement')
  dayRowElements!: QueryList<ElementRef<HTMLDivElement>>;

  expandedDate = signal<string | null>(null);
  private scrollbar: Scrollbar | null = null;
  private mediaQueryList: MediaQueryList | null = null;
  private readonly onMediaQueryChange = (e: MediaQueryListEvent) => {
    if (e.matches) {
      this.initScrollbar();
    } else {
      this.destroyScrollbar();
    }
  };

  private todayStr = this.getTodayString();

  protected periodLabel = computed(() => {
    return this.period() || '365D';
  });

  protected syncRangeLabel = computed(() => {
    const list = this.days();
    if (!list || list.length === 0) return '';
    const first = this.formatDateSlash(list[0].date);
    const last = this.formatDateSlash(list[list.length - 1].date);
    return `${first} ➔ ${last}`;
  });

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      this.mediaQueryList = window.matchMedia('(min-width: 768px)');
      if (this.mediaQueryList.matches) {
        this.initScrollbar();
      }
      this.mediaQueryList.addEventListener?.('change', this.onMediaQueryChange);
    } else {
      this.initScrollbar();
    }

    this.dayRowElements.changes.subscribe(() => {
      this.scrollbar?.update();
      this.scrollToToday();
    });

    if (this.days().length > 0) {
      setTimeout(() => this.scrollToToday(), 100);
    }
  }

  private initScrollbar(): void {
    if (this.scrollbar || !this.scrollContainer?.nativeElement) return;
    try {
      this.scrollbar = Scrollbar.init(this.scrollContainer.nativeElement, {
        damping: 0.08,
        alwaysShowTracks: true,
      });
    } catch (e) {
      console.warn('Smooth scrollbar fallback to native scroll', e);
    }
  }

  private destroyScrollbar(): void {
    if (this.scrollbar) {
      this.scrollbar.destroy();
      this.scrollbar = null;
    }
  }

  isToday(date: string): boolean {
    return date === this.todayStr;
  }

  isFuture(date: string): boolean {
    return date > this.todayStr;
  }

  toggleDay(date: string): void {
    this.expandedDate.update((current) => (current === date ? null : date));
    setTimeout(() => this.scrollbar?.update(), 50);
  }

  scrollToToday(): void {
    const targetElement = this.dayRowElements?.find(
      (el) => el.nativeElement.id === `ledger-day-${this.todayStr}`
    )?.nativeElement;

    if (!targetElement) return;

    if (this.scrollbar && this.scrollContainer) {
      const containerHeight = this.scrollContainer.nativeElement.clientHeight;
      const targetTop = targetElement.offsetTop;
      const targetHeight = targetElement.clientHeight;
      const scrollPos = targetTop - containerHeight / 2 + targetHeight / 2;
      this.scrollbar.scrollTo(0, Math.max(0, scrollPos), 600);
    } else if (typeof targetElement.scrollIntoView === 'function') {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  private getTodayString(): string {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  private formatDateSlash(isoDate: string): string {
    if (!isoDate) return '';
    const parts = isoDate.split('-');
    if (parts.length < 3) return isoDate;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  ngOnDestroy(): void {
    this.mediaQueryList?.removeEventListener?.('change', this.onMediaQueryChange);
    this.destroyScrollbar();
  }
}
