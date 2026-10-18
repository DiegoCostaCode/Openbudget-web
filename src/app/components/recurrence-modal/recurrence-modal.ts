import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Recurrences } from '../../services/recurrences';
import { Categories } from '../../services/categories';
import { RecurrenceDTO, TransactionFrequency } from '../../models/recurrences';
import { CategoryDTO } from '../../models/categories';
import { ObPanel } from '../../ui/components/ob-panel/ob-panel';
import { ObPanelBar } from '../../ui/components/ob-panel-bar/ob-panel-bar';
import { ObButton } from '../../ui/primitives/ob-button/ob-button';
import { ObBadge } from '../../ui/primitives/ob-badge/ob-badge';
import { ObMoney } from '../../ui/primitives/ob-money/ob-money';
import { ObIconBox } from '../../ui/primitives/ob-icon-box/ob-icon-box';
import { ObCurrencyInput } from '../../ui/primitives/ob-currency-input/ob-currency-input';
import { CategoryForm } from '../category-form/category-form';
import { LucideAngularModule } from 'lucide-angular';

export const FREQUENCY_LABELS: Record<string, string> = {
  DAILY: 'DIÁRIA',
  WEEKLY: 'SEMANAL',
  MONTHLY: 'MENSAL',
  YEARLY: 'ANUAL',
};

@Component({
  selector: 'app-recurrence-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ObPanel,
    ObPanelBar,
    ObButton,
    ObBadge,
    ObMoney,
    ObIconBox,
    ObCurrencyInput,
    CategoryForm,
    LucideAngularModule,
  ],
  templateUrl: './recurrence-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecurrenceModal implements OnInit {
  private fb = inject(FormBuilder);
  private recurrencesService = inject(Recurrences);
  private categoriesService = inject(Categories);

  closed = output<void>();
  createNewRecurrence = output<void>();
  changed = output<void>();

  activeView = signal<'LIST' | 'EDIT'>('LIST');
  recurrences = signal<RecurrenceDTO[]>([]);
  selectedRecurrence = signal<RecurrenceDTO | null>(null);
  categories = signal<CategoryDTO[]>([]);

  showCategoryModal = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  confirmingDelete = signal<boolean>(false);

  selectedEditType = signal<'INCOME' | 'EXPENSE'>('EXPENSE');

  editForm!: FormGroup;

  ngOnInit(): void {
    this.editForm = this.fb.group({
      description: ['', [Validators.required, Validators.maxLength(255)]],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      startDate: ['', [Validators.required]],
      frequency: ['MONTHLY', [Validators.required]],
      occurrences: [
        null,
        [Validators.min(2), Validators.max(999), Validators.pattern(/^\d+$/)],
      ],
      category: [''],
    });

    this.loadRecurrences();
    this.loadCategories();
  }

  resolveFrequency(rec: RecurrenceDTO): TransactionFrequency {
    if (rec.frequency) {
      const upper = String(rec.frequency).toUpperCase();
      if (upper === 'DAILY' || upper === 'WEEKLY' || upper === 'MONTHLY' || upper === 'YEARLY') {
        return upper as TransactionFrequency;
      }
    }

    if (rec.transactions && rec.transactions.length >= 2) {
      const dates = Array.from(
        new Set(rec.transactions.map((t) => t.transactionDate).filter(Boolean))
      ).sort();

      if (dates.length >= 2) {
        const d1 = new Date(dates[0]);
        const d2 = new Date(dates[1]);
        const diffDays = Math.round(Math.abs(d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays <= 2) return 'DAILY';
        if (diffDays >= 6 && diffDays <= 8) return 'WEEKLY';
        if (diffDays >= 27 && diffDays <= 32) return 'MONTHLY';
        if (diffDays >= 350) return 'YEARLY';
      }
    }

    return 'MONTHLY';
  }

  resolveOccurrences(rec: RecurrenceDTO): number | null {
    if (rec.occurrences !== undefined && rec.occurrences !== null && (rec.occurrences as any) !== '') {
      return Number(rec.occurrences);
    }

    if (rec.startDate && rec.endDate) {
      const d1 = new Date(rec.startDate);
      const d2 = new Date(rec.endDate);
      const diffDays = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays < 0) return null;

      const freq = this.resolveFrequency(rec);
      switch (freq) {
        case 'DAILY':
          return diffDays + 1;
        case 'WEEKLY':
          return Math.round(diffDays / 7) + 1;
        case 'MONTHLY': {
          const months = (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
          return months + 1;
        }
        case 'YEARLY':
          return d2.getFullYear() - d1.getFullYear() + 1;
      }
    }

    return null;
  }

  loadRecurrences(): void {
    this.isLoading.set(true);
    this.recurrencesService.findAll().subscribe({
      next: (list) => {
        this.isLoading.set(false);
        const normalized = list.map((rec) => ({
          ...rec,
          frequency: this.resolveFrequency(rec),
          occurrences: this.resolveOccurrences(rec),
        }));
        this.recurrences.set(normalized);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Erro ao carregar recorrências', err);
      },
    });
  }

  loadCategories(): void {
    this.categoriesService.findAll().subscribe({
      next: (cats) => this.categories.set(cats),
      error: (err) => console.error('Erro ao carregar categorias', err),
    });
  }

  getFrequencyLabel(freq: string): string {
    return FREQUENCY_LABELS[freq] || freq;
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  }

  openEdit(rec: RecurrenceDTO): void {
    const freq = this.resolveFrequency(rec);
    const occ = this.resolveOccurrences(rec);

    this.activeView.set('EDIT');
    this.selectedRecurrence.set(rec);
    this.selectedEditType.set(rec.type as 'INCOME' | 'EXPENSE');
    this.confirmingDelete.set(false);
    this.errorMessage.set(null);

    this.editForm.reset({
      description: rec.description,
      amount: rec.amount,
      startDate: rec.startDate,
      frequency: freq,
      occurrences: occ,
      category: rec.category?.name || '',
    });
  }

  backToList(): void {
    this.activeView.set('LIST');
    this.selectedRecurrence.set(null);
    this.confirmingDelete.set(false);
    this.errorMessage.set(null);
  }

  setEditType(type: 'INCOME' | 'EXPENSE'): void {
    this.selectedEditType.set(type);
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
    this.editForm.patchValue({ category: created.name });
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

    const rec = this.selectedRecurrence();
    if (!rec) return;

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.recurrencesService.delete(rec.id).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.changed.emit();
        this.loadRecurrences();
        this.backToList();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.confirmingDelete.set(false);
        this.errorMessage.set('FALHA AO EXCLUIR RECORRÊNCIA');
        console.error(err);
      },
    });
  }

  submitEdit(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    const rec = this.selectedRecurrence();
    if (!rec) return;

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const val = this.editForm.value;
    const catName = val.category?.trim() ? val.category.trim() : null;
    const occ =
      val.occurrences !== null && val.occurrences !== '' && !isNaN(Number(val.occurrences))
        ? Number(val.occurrences)
        : null;

    this.recurrencesService
      .update(rec.id, {
        description: val.description.trim(),
        amount: Number(val.amount),
        type: this.selectedEditType(),
        startDate: val.startDate,
        frequency: val.frequency as TransactionFrequency,
        occurrences: occ,
        category: catName,
      })
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.changed.emit();
          this.loadRecurrences();
          this.backToList();
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.errorMessage.set('FALHA AO ATUALIZAR RECORRÊNCIA');
          console.error(err);
        },
      });
  }
}
