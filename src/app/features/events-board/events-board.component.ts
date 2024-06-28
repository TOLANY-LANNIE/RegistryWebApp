import { Component, OnInit } from '@angular/core';
import { EventsService } from '../../services/events/events.service';
import { AttendeesService } from '../../services/attendees/attendees.service'; // Import the attendees service
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-events-board',
  templateUrl: './events-board.component.html',
  styleUrls: ['./events-board.component.scss'] // Correct typo from styleUrl to styleUrls
})
export class EventsBoardComponent implements OnInit {
  events: any[] = []; // To store events pulled from Firestore
  attendeeCounts: { [eventId: string]: number } = {}; // To store attendee counts
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;
  constructor(
    private service: EventsService,
    private attendeesService: AttendeesService, // Inject attendees service
    private router: Router
  ) {}

  ngOnInit() {
    this.getEvents(); // Load events after view initialization
    this.home = { icon: 'pi pi-home', routerLink: '/events' };
  }

  async getEvents() {
    try {
      // Fetch events from the service
      const events = await this.service.getAllEvents();

      // Filter events where event.Status is "Yes"
      this.events = events.filter((event: { Status: boolean; }) => event.Status === true);

      // Fetch attendee counts
      await this.loadAttendeeCounts();
    } catch (error) {
      console.error('Error fetching events:', error);
      // Handle the error appropriately
    }
  }

  /**
   * Load attendee counts for each event
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

  /**
   * Counts the number of Guest that have signed up
   * @param eventId 
   * @returns the guest count 
   */
  getAttendeeCount(eventId: string): number {
    return this.attendeeCounts[eventId] ?? 0; // Return 0 if count is not yet loaded
  }
}
