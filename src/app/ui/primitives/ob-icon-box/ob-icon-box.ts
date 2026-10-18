import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'ob-icon-box',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './ob-icon-box.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex size-7 shrink-0 items-center justify-center border border-line-faint bg-tint-fill',
  },
})
export class ObIconBox {
  type = input.required<string>();

  protected isIncome = computed(() => this.type()?.toUpperCase() === 'INCOME');
  protected iconName = computed(() => (this.isIncome() ? 'arrow-down-left' : 'arrow-up-right'));
}
