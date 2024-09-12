import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  email: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // Initialize Forgot Password Form Group
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      return;
    }
  
    this.email = this.forgotPasswordForm.get('email')?.value;
  
    // Call the auth service to send a password reset email
    this.authService.sendPasswordResetEmail(this.email)
      .then(() => {
        // Navigate to a confirmation page or display a success message
        this.router.navigate(['/auth/login']);
        this.showSuccessMessage();
      })
      .catch((err) => {
        // Handle errors (e.g., email not found)
        //console.error('Error resetting password', err);
        this.showErrorMessage();
      });
  }
  

   /**
   * Email sent Successfully
   */
   showSuccessMessage() {
    this.toastService.showSuccess('Success', 'Email sent successfully');
  }

  /**
   * Failed to send an email
   */
  showErrorMessage() {
    this.toastService.showError('Error', 'An error occcured  while sending an email.');
  }
}
