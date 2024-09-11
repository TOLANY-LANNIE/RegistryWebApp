declare var google: any;
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  hide = true; // To toggle password visibility
  loginForm: FormGroup;
  errorMessage: string = ''; // Add this property to store error messages
  email: string;
  password: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService:AuthService
  ) { }


  ngOnInit(){
    // Initialize Login Form Group
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]], 
      password: ['', Validators.required],
    });
  }

  clickEvent(event: MouseEvent): void {
    this.hide = !this.hide;
    event.stopPropagation();
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.email = this.loginForm.get('email')?.value;
    this.password = this.loginForm.get('password')?.value;

    this.authService.login(this.email, this.password).catch((error) => {
      this.errorMessage = 'Incorrect email or password'; // Set the error message
      this.loginForm.reset(); // Reset the form fields when login fails
    });
  }

}
