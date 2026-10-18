import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'ob-date',
  standalone: true,
  templateUrl: './ob-date.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-flex items-center gap-2 font-mono tabular-nums',
  },
})
export class ObDate {
  date = input.required<string>(); // ISO format YYYY-MM-DD
  isToday = input(false);
  isFuture = input(false);
  format = input<'full' | 'compact' | 'dot'>('full');
  showWeekday = input(true);

  private parsed = computed(() => {
    const raw = this.date();
    if (!raw) return null;
    const parts = raw.split('-');
    if (parts.length < 3) return null;
    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const day = Number(parts[2]);
    const d = new Date(year, month - 1, day, 12, 0, 0);
    return { year, month, day, d };
  });

  protected weekday = computed(() => {
    const p = this.parsed();
    if (!p) return '';
    const weekdays = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
    return weekdays[p.d.getDay()];
  });

  protected formattedDate = computed(() => {
    const p = this.parsed();
    if (!p) return this.date();
    const dd = String(p.day).padStart(2, '0');
    const mm = String(p.month).padStart(2, '0');
    const yyyy = p.year;

    switch (this.format()) {
      case 'compact':
        return `${dd}/${mm}`;
      case 'dot':
        return `${dd}.${mm}.${yyyy}`;
      case 'full':
      default:
        return `${dd}/${mm}/${yyyy}`;
    }
  });

  protected dateClasses = computed(() => {
    if (this.isToday()) {
      return 'text-sm font-bold text-fg';
    }
    if (this.isFuture()) {
      return 'text-fg-tertiary';
    }
    return 'text-fg-secondary';
  });
}
