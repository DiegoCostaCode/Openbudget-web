import {
  Directive,
  ElementRef,
  HostListener,
  Renderer2,
  forwardRef,
  inject,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: 'input[obCurrencyInput]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ObCurrencyInput),
      multi: true,
    },
  ],
})
export class ObCurrencyInput implements ControlValueAccessor {
  private el = inject(ElementRef<HTMLInputElement>);
  private renderer = inject(Renderer2);

  private onChange: (value: number | null) => void = () => {};
  private onTouched: () => void = () => {};

  private formatter = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '');

    if (!digits || Number(digits) === 0) {
      input.value = '';
      this.onChange(null);
      return;
    }

    const cents = Number(digits);
    const numericValue = cents / 100;
    const formatted = this.formatter.format(numericValue);

    input.value = formatted;
    this.onChange(numericValue);
  }

  @HostListener('blur')
  onBlur(): void {
    this.onTouched();
  }

  writeValue(value: number | string | null): void {
    const input = this.el.nativeElement;
    if (value !== null && value !== undefined && value !== '' && !isNaN(Number(value))) {
      const num = Number(value);
      input.value = this.formatter.format(num);
    } else {
      input.value = '';
    }
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.renderer.setProperty(this.el.nativeElement, 'disabled', isDisabled);
  }
}
