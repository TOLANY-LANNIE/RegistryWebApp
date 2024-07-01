import { Component, OnInit } from '@angular/core';
import { EventsService } from '../../services/events/events.service';
import { AttendeesService } from '../../services/attendees/attendees.service'; // Import the attendees service
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-events-board',
  templateUrl: './events-board.component.html',
  styleUrls: ['./events-board.component.scss'],
  providers: [DatePipe]
})
export class EventsBoardComponent implements OnInit {
  events: any[] = []; // To store events pulled from Firestore
  attendeeCounts: { [eventId: string]: number } = {}; // To store attendee counts
  filterOptions: string[] = ['All Events', "Today's Event", "This Week's Events", "This Month's Events"];
  selectedChip: string = 'All Events';
  filteredEvents: any[] = [];
  today: Date = new Date();
  weekStart: Date = new Date();
  weekEnd: Date = new Date();
  monthStart: Date = new Date();
  monthEnd: Date = new Date();

  items: MenuItem[] | undefined;
  home: MenuItem | undefined;
  constructor(
    private service: EventsService,
    private attendeesService: AttendeesService, // Inject attendees service
    private router: Router,
    private datePipe: DatePipe
  ) {
    this.today.setHours(0, 0, 0, 0); // Set to midnight for comparison
    this.weekStart = new Date(this.today);
    this.weekEnd = new Date(this.today);
    this.weekStart.setDate(this.weekStart.getDate() - this.weekStart.getDay()); // Start of the week (Sunday)
    this.weekEnd.setDate(this.weekEnd.getDate() + (6 - this.weekEnd.getDay())); // End of the week (Saturday)
    this.monthStart = new Date(this.today.getFullYear(), this.today.getMonth(), 1); // Start of the month
    this.monthEnd = new Date(this.today.getFullYear(), this.today.getMonth() + 1, 0); // End of the month
  }

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
       this.filterEvents();
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

  filterEvents(): void {
    switch (this.selectedChip) {
      case "Today's Event":
        this.filteredEvents = this.events.filter(event => {
          const eventDate = new Date(event.StartDate);
          return this.datePipe.transform(eventDate, 'yyyy-MM-dd') === this.datePipe.transform(this.today, 'yyyy-MM-dd');
        });
        break;

      case "This Week's Events":
        this.filteredEvents = this.events.filter(event => {
          const eventDate = new Date(event.StartDate);
          return eventDate >= this.weekStart && eventDate <= this.weekEnd;
        });
        break;

      case "This Month's Events":
        this.filteredEvents = this.events.filter(event => {
          const eventDate = new Date(event.StartDate);
          return eventDate >= this.monthStart && eventDate <= this.monthEnd;
        });
        break;
  
      case "All Events":
        this.filteredEvents = this.events;
        break;
    }
    console.log(this.filterEvents)
  }
}
