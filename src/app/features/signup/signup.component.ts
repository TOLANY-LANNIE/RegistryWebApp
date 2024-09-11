import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { ToastService } from '../../services/toast.service';
 /**
   * Custom validator to check if passwords match
   */
export function passwordsMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordsDontMatch: true };
    } else {
      return null;
    }
  };
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'] // Fixed styleUrls
})
export class SignupComponent implements OnInit {
  hide = true; // To toggle password visibility
  signUpForm: FormGroup;
  errorMessage: string = ''; // Store error messages
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string; // Fixed type to string

  /**
   * Constructor
   */
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    // Initialize Signup Form Group with custom validator
    this.signUpForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], 
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required] // Corrected form control name
    },
    { validators: passwordsMatchValidator() }
  );
  }

 
  /**
   * Toggle password visibility
   * @param event 
   */
  clickEvent(event: MouseEvent): void {
    this.hide = !this.hide;
    event.stopPropagation();
  }

  /**
   * Submit the user info to Firebase
   */
  onSubmit(): void {
  if (this.signUpForm.invalid) {
    return;
  }

  this.email = this.signUpForm.get('email')?.value;
  this.password = this.signUpForm.get('password')?.value;
  this.fullName = this.signUpForm.get('fullName')?.value;

  // Call the signup method from AuthService
  this.authService.signUp(this.email, this.password, this.fullName)
    .then(() => {
      // On successful signup, navigate to the desired route
      this.router.navigate(['/events-board']);
      this.showSuccessMessage();
    })
    .catch(error => {
      // Handle errors such as email already in use or weak password
      this.errorMessage = error.message;
      this.showErrorMessage();
    });
  }


  /**
   * Event added successfully message 
   */
  showSuccessMessage() {
    this.toastService.showSuccess('Success', 'Account created successfully');
  }

  /**
   * Failed to add the events to the Db 
   */
  showErrorMessage() {
    this.toastService.showError('Error', 'An error occurred during the operation.');
  }

}
