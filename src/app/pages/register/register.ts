import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { ObButton } from '../../ui/primitives/ob-button/ob-button';
import { ObCheckbox } from '../../ui/primitives/ob-checkbox/ob-checkbox';
import { ObPanel } from '../../ui/components/ob-panel/ob-panel';
import { ObPanelBar } from '../../ui/components/ob-panel-bar/ob-panel-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ObButton, ObCheckbox, ObPanel, ObPanelBar],
  templateUrl: './register.html',
  styleUrl: './register.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private router = inject(Router);

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
      ],
    ],
  });

  currentPassword = signal<string>('');
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  hasMinLength = computed(() => this.currentPassword().length >= 6);
  hasUpper = computed(() => /[A-Z]/.test(this.currentPassword()));
  hasLower = computed(() => /[a-z]/.test(this.currentPassword()));
  hasNumber = computed(() => /\d/.test(this.currentPassword()));

  onPasswordInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value || '';
    this.currentPassword.set(value);
  }

  register(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.isLoading.set(true);

    const { name, email, password } = this.form.value;

    this.auth.register({ name, email, password }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('CONTA CRIADA // REDIRECIONANDO PARA LOGIN');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1200);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          err?.status === 409
            ? 'ERRO // EMAIL JÁ CADASTRADO'
            : 'FALHA AO CRIAR CONTA // VERIFIQUE OS DADOS'
        );
      },
    });
  }
}
