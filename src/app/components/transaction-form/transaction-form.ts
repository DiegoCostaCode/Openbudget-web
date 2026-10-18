import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Transactions } from '../../services/transactions';
import { Recurrences } from '../../services/recurrences';
import { Categories } from '../../services/categories';
import { CategoryDTO } from '../../models/categories';
import { TransactionDTO } from '../../models/transactions';
import { TransactionFrequency } from '../../models/recurrences';
import { ObButton } from '../../ui/primitives/ob-button/ob-button';
import { ObCheckbox } from '../../ui/primitives/ob-checkbox/ob-checkbox';
import { ObPanel } from '../../ui/components/ob-panel/ob-panel';
import { ObPanelBar } from '../../ui/components/ob-panel-bar/ob-panel-bar';
import { ObCurrencyInput } from '../../ui/primitives/ob-currency-input/ob-currency-input';
import { CategoryForm } from '../category-form/category-form';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ObButton,
    ObCheckbox,
    ObPanel,
    ObPanelBar,
    ObCurrencyInput,
    CategoryForm,
  ],
  templateUrl: './transaction-form.html',
  styleUrl: './transaction-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionForm implements OnInit {
  private fb = inject(FormBuilder);
  private transactionsService = inject(Transactions);
  private recurrencesService = inject(Recurrences);
  private categoriesService = inject(Categories);

  initialDate = input<string | null>(null);
  initialType = input<'INCOME' | 'EXPENSE'>('EXPENSE');
  initialEntryMode = input<'SINGLE' | 'RECURRING'>('SINGLE');
  transaction = input<TransactionDTO | null>(null);

  saved = output<void>();
  deleted = output<void>();
  cancelled = output<void>();

  form!: FormGroup;
  selectedType = signal<'INCOME' | 'EXPENSE'>('EXPENSE');
  isRecurring = signal<boolean>(false);
  categories = signal<CategoryDTO[]>([]);
  showCategoryModal = signal<boolean>(false);
  confirmingDelete = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  isEditMode = computed(() => !!this.transaction());

  ngOnInit(): void {
    const tx = this.transaction();
    const defaultDate = tx?.transactionDate || this.initialDate() || this.getTodayString();
    const defaultType = (tx?.type?.toUpperCase() as 'INCOME' | 'EXPENSE') || this.initialType() || 'EXPENSE';
    this.selectedType.set(defaultType);

    if (tx) {
      this.isRecurring.set(false);
    } else {
      this.isRecurring.set(this.initialEntryMode() === 'RECURRING');
    }

    this.form = this.fb.group({
      description: [tx?.description || '', [Validators.required, Validators.maxLength(255)]],
      amount: [tx?.amount ?? null, [Validators.required, Validators.min(0.01)]],
      transactionDate: [defaultDate, [Validators.required]],
      frequency: ['MONTHLY', [Validators.required]],
      occurrences: [
        null,
        [Validators.min(2), Validators.max(999), Validators.pattern(/^\d+$/)],
      ],
      category: [tx?.category?.name || ''],
    });

    this.loadCategories();
  }

  loadCategories(): void {
    this.categoriesService.findAll().subscribe({
      next: (cats) => this.categories.set(cats),
      error: (err) => console.error('Erro ao carregar categorias', err),
    });
  }

  setType(type: 'INCOME' | 'EXPENSE'): void {
    this.selectedType.set(type);
  }

  openNewCategoryModal(): void {
    this.showCategoryModal.set(true);
  }

  onCategorySaved(created: CategoryDTO): void {
    this.categories.update((prev) => {
      if (prev.some((c) => c.name.toUpperCase() === created.name.toUpperCase())) {
        return prev;
      }
      return [...prev, created];
    });
    this.form.patchValue({ category: created.name });
    this.showCategoryModal.set(false);
  }

  onCategoryCancelled(): void {
    this.showCategoryModal.set(false);
  }

  requestDelete(): void {
    if (!this.confirmingDelete()) {
      this.confirmingDelete.set(true);
      return;
    }

    const tx = this.transaction();
    if (!tx) return;

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.transactionsService.deleteTransaction(tx.id).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.deleted.emit();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.confirmingDelete.set(false);
        this.errorMessage.set('FALHA AO EXCLUIR TRANSAÇÃO');
        console.error(err);
      },
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const val = this.form.value;
    const catName = val.category?.trim() ? val.category.trim() : undefined;

    if (this.isEditMode()) {
      const tx = this.transaction()!;
      this.transactionsService
        .updateTransaction(tx.id, {
          description: val.description.trim(),
          amount: Number(val.amount),
          type: this.selectedType(),
          transactionDate: val.transactionDate,
          category: catName,
        })
        .subscribe({
          next: () => {
            this.isSubmitting.set(false);
            this.saved.emit();
          },
          error: (err) => {
            this.isSubmitting.set(false);
            this.errorMessage.set('FALHA AO ATUALIZAR TRANSAÇÃO');
            console.error(err);
          },
        });
      return;
    }

    if (this.isRecurring()) {
      const occ =
        val.occurrences !== null && val.occurrences !== '' && !isNaN(Number(val.occurrences))
          ? Number(val.occurrences)
          : null;
      this.recurrencesService
        .create({
          description: val.description.trim(),
          amount: Number(val.amount),
          type: this.selectedType(),
          startDate: val.transactionDate,
          frequency: val.frequency as TransactionFrequency,
          occurrences: occ,
          category: catName || null,
        })
        .subscribe({
          next: () => {
            this.isSubmitting.set(false);
            this.saved.emit();
          },
          error: (err) => {
            this.isSubmitting.set(false);
            this.errorMessage.set('FALHA AO SALVAR RECORRÊNCIA');
            console.error(err);
          },
        });
      return;
    }

    this.transactionsService
      .createTransaction({
        description: val.description.trim(),
        amount: Number(val.amount),
        type: this.selectedType(),
        transactionDate: val.transactionDate,
        category: catName,
      })
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.saved.emit();
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.errorMessage.set('FALHA AO SALVAR TRANSAÇÃO');
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
