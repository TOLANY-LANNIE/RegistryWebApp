declare var google: any;
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environment/environment';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  hide = true;
  loginForm: FormGroup;
  email: string;
  password: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
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
  }
}
