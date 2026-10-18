import { ChangeDetectionStrategy, Component, model, output } from '@angular/core';
import { ObSegmentedControl } from '../../components/ob-segmented-control/ob-segmented-control';
import { ObButton } from '../../primitives/ob-button/ob-button';
import { ObMarker } from '../../primitives/ob-marker/ob-marker';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'ob-toolbar',
  standalone: true,
  imports: [ObSegmentedControl, ObButton, ObMarker, LucideAngularModule],
  templateUrl: './ob-toolbar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObToolbar {
  period = model<string>('12M');

  goToToday = output<void>();
  newTransaction = output<void>();
}
