import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function startsWithZeroValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    return value && value.startsWith('0') ? null : { startsWithZero: true };
  };
}

export function hasTwelveDigitsValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const isValid = value && /^\d{3}-\d{3}-\d{4}$/.test(value);
      return isValid ? null : { hasTwelveDigits: true };
    };
  }
