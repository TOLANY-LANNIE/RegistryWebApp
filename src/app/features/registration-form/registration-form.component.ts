import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AttendeesService } from '../../services/attendees/attendees.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { startsWithZeroValidator } from '../../utils/validators';
import {  hasTwelveDigitsValidator } from '../../utils/validators';
import { Guest } from '../../models/guests.mode';
import { EventsService } from '../../services/events/events.service';

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

  imageSrc: string ='../../../assets/img/Pfizer_Horizon Logo_Final.jpg';
  imageAvailable: boolean = true;
  eventDetails:any;


  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private service: AttendeesService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private eventService: EventsService
  ) { 
    this.checkImageAvailability();
  }

  ngOnInit(): void {
    this.eventId = this.route.snapshot.queryParams['eventId'];
    this.getEventDetails(this.eventId);
    this.attendeeForm = this.fb.group({
      honorific: ['', Validators.required],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      practiseNumber: ['', Validators.required],
      contact: ['', [Validators.required, startsWithZeroValidator(),  hasTwelveDigitsValidator()]],
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

      const guest: Guest = {
        Event: this.eventId,
        Honorific: this.attendeeForm.value.honorific,
        Name: this.attendeeForm.value.name,
        Surname: this.attendeeForm.value.surname,
        PractiseNumber: this.attendeeForm.value.practiseNumber,
        Contact: this.attendeeForm.value.contact,
        Email: this.attendeeForm.value.email,
        DietaryPreference: this.attendeeForm.value.dietaryPreference,
        ReturnRoute: this.attendeeForm.value.returnRoute,
        Transfer: this.attendeeForm.value.transfer,
        Accommodation: this.attendeeForm.value.accommodation
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
  /**
   * Check in the Event Object has an Event image
   */
  checkImageAvailability() {
    const img = new Image();
    img.src = this.imageSrc;
    img.onload = () => this.imageAvailable = true;
    img.onerror = () => this.imageAvailable = false;
  }

  /**
   * Get Event Details based on the id
   */
 async getEventDetails(eventID:string){
    this.eventService.getEventById(eventID).subscribe(
      event => {
        this.eventDetails = event;
        //console.log(this.eventDetails);
      },
      error => {
        console.log( error.message);
      }
    );
  }

  formatDate(date: string): string {
    // Convert date to 'MM/dd/yyyy'
    return this.datePipe.transform(date, 'MM/dd/yyyy') ?? '';
  }
}
