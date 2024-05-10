import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Guest } from '../../models/guests.mode';
import { DatePipe } from '@angular/common';
import { AttendeesService } from '../../services/attendees/attendees.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrl: './registration-form.component.scss',
  providers: [DatePipe] 
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

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private service: AttendeesService,
    private router: Router
  ) { }

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
    // Getting data from the addEventFormGroup
    const formattedDate = this.datePipe.transform(this.attendeeForm.value.date, 'dd/MM/yyyy'); // Format date
    const guest:Guest = {
      PracticeNumber:this.attendeeForm.value.practiseNumber,
      Name:this.attendeeForm.value.name,
      Surname:this.attendeeForm.value.surname,
      Contact: this.attendeeForm.value.contact,
      Email:this.attendeeForm.value.email,
      Dietary: this.attendeeForm.value.dietaryPreference,
      Allergies: this.attendeeForm.value.allergies,
      FlightDate:this.attendeeForm.value.flightDate,
      FlightDetails: this.attendeeForm.value.flightDetails,
      TransfersRequired:this.attendeeForm.value.transfer,
      AccomodationRequired: this.attendeeForm.value.accommodation,
      Event:"adBDB7i7Zoansx0ehg9X"
    };

    this.service.addNewAttendee(guest)
    .then(() => {
      this.router.navigate(['/thank-you']);
      console.log('Guest added successfully');

    })
    .catch(error => {
      console.error('Error adding guest', error);
      // Optionally, you can handle the error here, such as displaying a message to the user
    });
  }
}
