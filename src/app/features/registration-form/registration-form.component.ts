import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AttendeesService } from '../../services/attendees/attendees.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { startsWithZeroValidator } from '../../utils/validators';
import {  hasTwelveDigitsValidator } from '../../utils/validators';
import { Guest } from '../../models/guests.mode';
import { EventsService } from '../../services/events/events.service';
import emailjs from '@emailjs/browser';
import { Notification } from '../../models/notification';
import { NotificationService } from '../../services/notification-service/notification-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss'],
  providers: [DatePipe] 
})
export class RegistrationFormComponent implements OnInit {
  events: any[] = []; // To store events pulled from Firestore
  attendeeCounts: { [eventId: string]: number } = {}; // To store attendee counts
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
  private eventsSubscription: Subscription;


  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private service: AttendeesService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private eventService: EventsService,
    private attendeesService: AttendeesService,
    private notificationService: NotificationService,
  ) { 
    this.checkImageAvailability();
  }

  ngOnInit(): void {
    this.eventId = this.route.snapshot.queryParams['eventId'];
    if (this.eventId) {
      this.getEventDetails(this.eventId);
    }
    
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

    this.subscribeToEvents();// Subscribe to events and automatically update when changes occur
  }

  ngOnDestroy() {
    if (this.eventsSubscription) {
      this.eventsSubscription.unsubscribe();
    }
  }

  async onSubmit() {
    if (this.attendeeForm.invalid) {
      return;
    }

    const practiceNumber = this.attendeeForm.value.practiseNumber;
    const contact = this.attendeeForm.value.contact;
    const email = this.attendeeForm.value.email;

    try {
      const guestExists = await this.service.checkGuestExists(this.attendeeForm.value.practiseNumber, this.attendeeForm.value.contact, this.attendeeForm.value.email, this.eventId);
      if (guestExists) {
        this.showRecordExists();
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
      this.showSuccessMessage();
      this.sendConfirmationEmail();
      this.sendNotifaction();
    
    } catch (error) {

      this.showErrorMessage()
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
   * 
   */
  subscribeToEvents() {
    this.eventsSubscription = this.eventService.getEvents().subscribe({
      next: (events) => {
        // Filter events where event.Status is "Yes"
        this.events = events.filter((event: { Status: boolean }) => event.Status === true);
        this.loadAttendeeCounts(); // Fetch attendee counts after loading events
      },
      error: (error) => {
        console.error('Error fetching events:', error);
      }
    });
  }

  /**
   * Get Event Details based on the id
   */
 async getEventDetails(eventID:string){
    this.eventService.getEventById(eventID).subscribe(
      event => {
        this.eventDetails = event;
        if (this.eventDetails.BannerUrl) {
          this.imageSrc = this.eventDetails.BannerUrl;
        } else {
          this.imageSrc = '';
        }
        this.checkImageAvailability(); // Check if the image is available
      },
      error => {
        console.log( error.message);
      }
    );
  }

  formatDate(date: string): string {
    // Convert date to 'MMMM d, y'
    return this.datePipe.transform(date, 'MMMM d, y') ?? '';
  }

   /**
   * Event added successfully message 
   */
   showSuccessMessage() {
    this.toastService.showSuccess('Success', 'Registered successfully');
  }

  /**
   * Failed to added the events to the Db 
   */
  showErrorMessage() {
    this.toastService.showError('Error', 'An error occurred during the operation.');
  }

  showRecordExists(){
    this.toastService.showError('Error', 'Guest with the same practice number, contact, or email is already registered for this event.');
  }

  sendConfirmationEmail() {
    if (!this.eventDetails) {
      this.toastService.showError('Error', 'Event details are not available.');
      return;
    }
  
    emailjs.init("KDgLZCkmqFbxsdIxR");
  
    emailjs.send("service_lp2dh2j", "template_9k4bqsd", {
      Title: this.eventDetails.Title,
      RecipientName: this.attendeeForm.value.name + " " + this.attendeeForm.value.surname,
      StartDate: this.eventDetails.StartDate,
      EndDate: this.eventDetails.EndDate,
      Location: this.eventDetails.Location,
      Capacity: this.eventDetails.Capacity,
      Description: this.eventDetails.Description,
      ContactInformation: "0123456789",
      SenderName: "Event Registry App",
      SenderTitle: "Event Planner",
      CurrentYear: "2024",
      from_name: "Thulani",
      reply_to: "thulani.mpofu2021@outlook.com",
      send_to: this.attendeeForm.value.email,
    }).then(response => {
      this.toastService.showSuccess('Success', 'Confirmation email sent successfully');
    }).catch(error => {
      this.toastService.showError('Error', 'Failed to send confirmation email');
    });
  }
  
  async sendNotifaction() {
    if (!this.eventDetails) {
      this.toastService.showError('Error', 'Event details are not available.');
      return;
    }
  
    const notification: Notification = {
      Date: new Date().toISOString(),
      Message: this.attendeeForm.value.name + " " + this.attendeeForm.value.surname + " has registered for the event " + this.eventDetails.Title,
      Read: false,
      Hide: false,
      User: ""
    };
  
    await this.notificationService.addNotification(notification);
  }
  
  /**
   * Get the number of attendees for each event
   */
  async loadAttendeeCounts() {
    for (const event of this.events) {
      try {
        const count = await this.attendeesService.getAttendeesCountByEvent(event.id);
        this.attendeeCounts[event.id] = count;
      } catch (error) {
        console.error('Error fetching attendee count for event ID', event.id, ':', error);
        this.attendeeCounts[event.id] = 0; // Handle the error appropriately
      }
    }
  }
}
