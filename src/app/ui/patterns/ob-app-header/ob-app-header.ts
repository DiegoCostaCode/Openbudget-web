import { ChangeDetectionStrategy, Component, inject, input, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../../services/auth';
import { ObButton } from '../../primitives/ob-button/ob-button';
import { ObMarker } from '../../primitives/ob-marker/ob-marker';

@Component({
  selector: 'ob-app-header',
  standalone: true,
  imports: [ObButton, ObMarker],
  templateUrl: './ob-app-header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObAppHeader implements OnInit {
  private auth = inject(Auth);
  private router = inject(Router);

  period = input<string>('12M');
  protected userEmail = signal<string | null>(null);

  ngOnInit(): void {
    this.auth.getProfile().subscribe({
      next: (user: any) => {
        if (user?.email) {
          this.userEmail.set(user.email);
        }
      },
      error: () => {},
    });
  }

  logout(): void {
    // Navigate to login
    this.router.navigate(['/login']);
  }
}
