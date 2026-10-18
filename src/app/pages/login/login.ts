import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { Auth } from '../../services/auth';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ObButton } from '../../ui/primitives/ob-button/ob-button';
import { ObPanel } from '../../ui/components/ob-panel/ob-panel';
import { ObPanelBar } from '../../ui/components/ob-panel-bar/ob-panel-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ObButton, ObPanel, ObPanelBar],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private router = inject(Router);

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  errorMessage = signal<string | null>(null);
  isLoading = signal(false);

  login(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);
    this.isLoading.set(true);

    this.auth.login(this.form.value.email, this.form.value.password).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          err?.status === 401
            ? 'CREDENCIAS INVÁLIDAS // VERIFIQUE EMAIL E SENHA'
            : 'FALHA NA CONEXÃO COM O SERVIÇO'
        );
      },
    });
  }
}
