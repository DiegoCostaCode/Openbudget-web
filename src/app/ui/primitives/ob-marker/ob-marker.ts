import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'ob-marker',
  standalone: true,
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
    'aria-hidden': 'true',
  },
})
export class ObMarker {
  size = input<'sm' | 'md'>('sm');
  variant = input<'default' | 'neutral'>('default');

  protected classes = computed(() => {
    const sizeCls = this.size() === 'md' ? 'size-2' : 'size-1.5';
    const colorCls = this.variant() === 'neutral' ? 'bg-fg-muted' : 'bg-fg';
    return `inline-block ${sizeCls} shrink-0 ${colorCls}`;
  });
}
