import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Transactions } from '../../services/transactions';
import { ObButton } from '../../ui/primitives/ob-button/ob-button';
import { ObPanel } from '../../ui/components/ob-panel/ob-panel';
import { ObPanelBar } from '../../ui/components/ob-panel-bar/ob-panel-bar';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [ReactiveFormsModule, ObButton, ObPanel, ObPanelBar, LucideAngularModule],
  templateUrl: './transaction-form.html',
  styleUrl: './transaction-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionForm implements OnInit {
  private fb = inject(FormBuilder);
  private transactions = inject(Transactions);

  initialDate = input<string | null>(null);
  initialType = input<'INCOME' | 'EXPENSE'>('EXPENSE');

  saved = output<void>();
  cancelled = output<void>();

  form!: FormGroup;
  selectedType = signal<'INCOME' | 'EXPENSE'>('EXPENSE');
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    const defaultDate = this.initialDate() || this.getTodayString();
    const defaultType = this.initialType() || 'EXPENSE';
    this.selectedType.set(defaultType);

    this.form = this.fb.group({
      description: ['', [Validators.required, Validators.maxLength(255)]],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      transactionDate: [defaultDate, [Validators.required]],
      category: [''],
    });
  }

  setType(type: 'INCOME' | 'EXPENSE'): void {
    this.selectedType.set(type);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const val = this.form.value;
    this.transactions
      .createTransaction({
        description: val.description.trim(),
        amount: Number(val.amount),
        type: this.selectedType(),
        transactionDate: val.transactionDate,
        category: val.category?.trim() ? val.category.trim() : undefined,
      })
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.saved.emit();
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.errorMessage.set('FALHA AO SALVAR // VERIFIQUE OS CAMPOS E TENTE NOVAMENTE');
          console.error(err);
        },
      });
  }

  private getTodayString(): string {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
}
