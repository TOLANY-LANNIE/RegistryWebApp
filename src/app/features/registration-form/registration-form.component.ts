import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrl: './registration-form.component.scss'
})
export class RegistrationFormComponent implements OnInit {
  attendeeForm: FormGroup;

  /**
   * Attendee's Details
   */
  practiseNumber='';
  name='';
  surname='';
  contact='';
  email='';
  dietaryPreference='';
  allergies=''
  flightDate:Date
  flightDetails='';
  transfer: boolean;
  accommodation: boolean;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.attendeeForm = this.fb.group({
      practiseNumber:['',Validators.required],
      name:['',Validators.required],
      surname:['',Validators.required],
      contact: ['', [Validators.required]],
      email: ['', [Validators.required,  Validators.email]],
      dietaryPreference: ['', [Validators.required]],
      allergies: ['', [Validators.required]],
      flightDate:['', [Validators.required]],
      flightDetails: ['', [Validators.required]],
      transfer: ['', [Validators.required]],
      accommodation: ['', [Validators.required]],
    
    });
  }

  onSubmit() {
    if (this.attendeeForm.invalid) {
      return
    } 
  }
}
