import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'ob-panel',
  standalone: true,
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
  },
})
export class ObPanel {
  variant = input<'primary' | 'secondary'>('primary');

  protected classes = computed(() => {
    return this.variant() === 'primary'
      ? 'block border border-line-strong bg-surface'
      : 'block border border-line bg-surface';
  });
}
