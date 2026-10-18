import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ObMarker } from '../../primitives/ob-marker/ob-marker';

@Component({
  selector: 'ob-panel-bar',
  standalone: true,
  imports: [ObMarker],
  templateUrl: './ob-panel-bar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
  },
})
export class ObPanelBar {
  title = input.required<string>();
  meta = input<string | null>(null);
  position = input<'top' | 'bottom'>('top');

  protected markerSize = computed(() => (this.position() === 'top' ? 'md' : 'sm'));

  protected classes = computed(() => {
    const borderCls = this.position() === 'top' ? 'border-b border-line' : 'border-t border-line';
    return `flex items-center justify-between gap-4 bg-surface-sunken px-6 py-2.5 ${borderCls}`;
  });

  protected titleClasses = computed(() => {
    return this.position() === 'top'
      ? 'text-xs font-bold uppercase tracking-widest text-fg'
      : 'text-label uppercase text-fg-subtle';
  });
}
