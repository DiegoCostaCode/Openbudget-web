import { ChangeDetectionStrategy, Component, model, input } from '@angular/core';

@Component({
  selector: 'ob-segmented-control',
  standalone: true,
  templateUrl: './ob-segmented-control.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObSegmentedControl {
  options = input<string[]>(['30D', '90D', '12M']);
  value = model<string>('12M');

  select(opt: string): void {
    this.value.set(opt);
  }
}
