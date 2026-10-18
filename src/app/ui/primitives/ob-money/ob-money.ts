import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type MoneyVariant = 'balance' | 'income' | 'expense' | 'empty';

const BRL_FORMATTER = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

@Component({
  selector: 'ob-money',
  standalone: true,
  templateUrl: './ob-money.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-block font-mono tabular-nums',
  },
})
export class ObMoney {
  amount = input<number | null | undefined>(null);
  variant = input<MoneyVariant>('balance');
  isProjected = input(false);
  emptyIfZero = input(false);

  protected isEmpty = computed(() => {
    if (this.variant() === 'empty') return true;
    const val = this.amount();
    if (val === null || val === undefined) return true;
    if (this.emptyIfZero() && val === 0) return true;
    return false;
  });

  protected isNegative = computed(() => {
    const val = this.amount();
    return val !== null && val !== undefined && val < 0;
  });

  protected displayPrefix = computed(() => {
    const v = this.variant();
    if (v === 'income') return '+ ';
    if (v === 'expense') return '- ';
    if (v === 'balance' && this.isNegative()) return '- ';
    return '';
  });

  protected formattedAmount = computed(() => {
    const val = this.amount();
    if (val === null || val === undefined) return '—';
    return BRL_FORMATTER.format(Math.abs(val));
  });

  protected moneyClasses = computed(() => {
    const v = this.variant();

    if (v === 'income') {
      return 'font-bold text-fg tabular-nums';
    }

    if (v === 'expense') {
      return 'font-medium text-fg-tertiary tabular-nums';
    }

    if (v === 'balance') {
      if (this.isNegative()) {
        return 'bg-accent px-1 font-bold text-on-accent tabular-nums';
      }
      if (this.isProjected()) {
        return 'font-bold text-fg-secondary tabular-nums';
      }
      return 'font-bold text-fg tabular-nums';
    }

    return 'text-fg-subtle tabular-nums';
  });
}
