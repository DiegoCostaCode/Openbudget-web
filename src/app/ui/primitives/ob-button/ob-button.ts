import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input } from '@angular/core';

const BASE =
  'inline-flex items-center justify-center gap-2 border uppercase transition-colors ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg ' +
  'disabled:pointer-events-none disabled:opacity-40 cursor-pointer';

const VARIANTS = {
  primary: 'border-accent bg-accent font-bold tracking-wider text-on-accent hover:border-accent-hover hover:bg-accent-hover',
  secondary: 'border-line-strong bg-surface font-medium text-fg hover:bg-surface-hover',
  ghost: 'border-line bg-surface-sunken text-fg-muted hover:text-fg',
  tint: 'border-line-strong bg-tint-fill font-bold text-fg hover:bg-tint-strong',
} as const;

const SIZES = {
  xs: 'px-2.5 py-0.5 text-label',
  sm: 'px-4 py-1.5 text-xs',
  md: 'px-4 py-2 text-xs',
  lg: 'px-4 py-2.5 text-xs',
} as const;

@Component({
  selector: 'button[obButton], a[obButton]',
  standalone: true,
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
    'attr.data-interactive': 'true',
  },
})
export class ObButton {
  variant = input<keyof typeof VARIANTS>('secondary');
  size = input<keyof typeof SIZES>('md');
  block = input(false, { transform: booleanAttribute });

  protected classes = computed(() =>
    [BASE, VARIANTS[this.variant()], SIZES[this.size()], this.block() ? 'w-full' : ''].join(' ')
  );
}
