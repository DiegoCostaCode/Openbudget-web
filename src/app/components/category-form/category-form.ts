import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Categories } from '../../services/categories';
import { CategoryDTO } from '../../models/categories';
import { ObPanel } from '../../ui/components/ob-panel/ob-panel';
import { ObPanelBar } from '../../ui/components/ob-panel-bar/ob-panel-bar';
import { ObButton } from '../../ui/primitives/ob-button/ob-button';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [ReactiveFormsModule, ObPanel, ObPanelBar, ObButton],
  templateUrl: './category-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryForm {
  private fb = inject(FormBuilder);
  private categoriesService = inject(Categories);

  saved = output<CategoryDTO>();
  cancelled = output<void>();

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
  });

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const rawName = this.form.value.name?.trim().toUpperCase();
    if (!rawName || rawName.length < 3 || rawName.length > 20) {
      this.form.get('name')?.setErrors({ invalidLength: true });
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.categoriesService.create(rawName).subscribe({
      next: (created) => {
        this.isLoading.set(false);
        this.saved.emit(created);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          err?.status === 409
            ? 'ERRO // CATEGORIA JÁ EXISTE'
            : 'FALHA AO SALVAR CATEGORIA'
        );
      },
    });
  }
}
