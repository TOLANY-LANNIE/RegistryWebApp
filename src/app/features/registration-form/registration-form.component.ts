import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AttendeesService } from '../../services/attendees/attendees.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { startsWithZeroValidator } from '../../utils/validators';
import { hasTenDigitsValidator } from '../../utils/validators';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss'],
  providers: [DatePipe] 
})
export class RegistrationFormComponent implements OnInit {
  attendeeForm: FormGroup;
  eventId: string;
  
  honorific:string;
  name: any;
  surname: any;
  contact: any;
  practiseNumber: any;
  email: any;
  dietaryPreference: any;
  returnRoute: any;
  transfer: any;
  accommodation: any;
  

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
    //console.log(this.eventId)
    this.attendeeForm = this.fb.group({
      honorific: ['', Validators.required],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      practiseNumber: ['', Validators.required],
      contact: ['', [Validators.required, startsWithZeroValidator(), hasTenDigitsValidator()]],
      email: ['', [Validators.required, Validators.email]],
      dietaryPreference: ['', [Validators.required]],
      returnRoute: ['', [Validators.required]],
      transfer: ['', [Validators.required]],
      accommodation: ['', [Validators.required]],
    });
  }

  async onSubmit() {
    if (this.attendeeForm.invalid) {
      return;
    }

    const practiceNumber = this.attendeeForm.value.practiseNumber;
    const contact = this.attendeeForm.value.contact;
    const email = this.attendeeForm.value.email;

    try {
      const guestExists = await this.service.checkGuestExists(practiceNumber, contact, email, this.eventId);
      if (guestExists) {
        this.snackBar.open('Guest with the same practice number, contact, or email is already registered for this event.', 'Close', {
          duration: 3000,
          panelClass: 'snackbar'
        });
        return;
      }

      const formattedDate = this.datePipe.transform(this.attendeeForm.value.flightDate, 'dd/MM/yyyy');
      const guest= {
        PracticeNumber: practiceNumber,
        Name: this.attendeeForm.value.name,
        Surname: this.attendeeForm.value.surname,
        Contact: contact,
        Email: email,
        Dietary: this.attendeeForm.value.dietaryPreference,
        Allergies: this.attendeeForm.value.allergies,
        FlightDate: formattedDate,
        FlightDetails: this.attendeeForm.value.flightDetails,
        TransfersRequired: this.attendeeForm.value.transfer,
        AccomodationRequired: this.attendeeForm.value.accommodation,
        Event: this.eventId
      };

      await this.service.addNewAttendee(guest);
      this.router.navigate(['/invite/thank-you']);
      this.snackBar.open('Form submitted successfully', 'Close',{
        duration: 5000,
        panelClass: ['success'],
      });
    
    } catch (error) {

      this.snackBar.open('Failed to submit form. Please try again later.', 'Close', {
        duration: 5000,
        panelClass: ['error'],
      });
    }
  }
}
