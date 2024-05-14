import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Guest } from '../../models/guests.mode';
import { DatePipe } from '@angular/common';
import { AttendeesService } from '../../services/attendees/attendees.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  eventId: string;

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private service: AttendeesService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.eventId = this.route.snapshot.queryParams['eventId'];
    console.log(this.eventId)
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
    const formattedDate = this.datePipe.transform(this.attendeeForm.value.flightDate, 'dd/MM/yyyy'); // Format date
    const guest:Guest = {
      PracticeNumber:this.attendeeForm.value.practiseNumber,
      Name:this.attendeeForm.value.name,
      Surname:this.attendeeForm.value.surname,
      Contact: this.attendeeForm.value.contact,
      Email:this.attendeeForm.value.email,
      Dietary: this.attendeeForm.value.dietaryPreference,
      Allergies: this.attendeeForm.value.allergies,
      FlightDate:formattedDate,
      FlightDetails: this.attendeeForm.value.flightDetails,
      TransfersRequired:this.attendeeForm.value.transfer,
      AccomodationRequired: this.attendeeForm.value.accommodation,
      Event:this.eventId
    };

    this.service.addNewAttendee(guest)
    .then(() => {
      this.router.navigate(['/invite/thank-you']);
      this.snackBar.open('Form submitted successfully', 'Close', {
        duration: 2000, // Duration in milliseconds
        panelClass: 'snackbar'
      });
    })
    .catch(error => {
      //console.error('Error adding guest', error);
      this.snackBar.open('Failed to submit form', 'Close', {
        duration: 2000, // Duration in milliseconds
        panelClass: 'snackbar'
      });
    });
  }
}
