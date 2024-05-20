import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appPhoneNumberFormatter]'
})
export class PhoneNumberFormatterDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: any) {
    const initialValue = this.el.nativeElement.value;

    // Remove all non-digit characters
    const numbersOnly = initialValue.replace(/\D/g, '');

    // Format the number according to the pattern
    let formattedNumber = '';
    if (numbersOnly.length <= 3) {
      formattedNumber = numbersOnly;
    } else if (numbersOnly.length <= 6) {
      formattedNumber = `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3, 6)}`;
    } else {
      formattedNumber = `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3, 6)}-${numbersOnly.slice(6, 10)}`;
    }

    this.el.nativeElement.value = formattedNumber;

    // Emit input event to update the control's value
    event.stopPropagation();
  }
}
