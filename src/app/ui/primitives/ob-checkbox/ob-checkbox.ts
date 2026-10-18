import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

@Component({
  selector: 'ob-checkbox',
  standalone: true,
  templateUrl: './ob-checkbox.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObCheckbox {
  checked = model<boolean>(false);
  label = input<string>('');
  size = input<'sm' | 'md'>('md');
  readonly = input<boolean>(false);

  toggle(): void {
    if (!this.readonly()) {
      this.checked.update((v) => !v);
    }
  }
}
