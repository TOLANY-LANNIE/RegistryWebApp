import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventsService } from '../../services/events/events.service';
import { AttendeesService } from '../../services/attendees/attendees.service';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { SearchService } from '../../services/search/search.service';

@Component({
  selector: 'app-events-board',
  templateUrl: './events-board.component.html',
  styleUrls: ['./events-board.component.scss'],
  providers: [DatePipe]
})
export class EventsBoardComponent implements OnInit, OnDestroy {
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
  sortAscending: boolean = true; // Variable to store sort order

  items: MenuItem[] | undefined;
  home: MenuItem | undefined;
  private eventsSubscription: Subscription;

  constructor(
    private service: EventsService,
    private attendeesService: AttendeesService,
    private router: Router,
    private datePipe: DatePipe,
    private searchService: SearchService
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
    this.subscribeToEvents(); // Subscribe to events and automatically update when changes occur
    this.home = { icon: 'pi pi-home', routerLink: '/events' };

    // Subscribe to the search query and filter events accordingly
  this.searchService.searchQuery$.subscribe((searchQuery: string) => {
    this.filterEvents(searchQuery);
  });
  }

  ngOnDestroy() {
    if (this.eventsSubscription) {
      this.eventsSubscription.unsubscribe();
    }
  }

  subscribeToEvents() {
    this.eventsSubscription = this.service.getAllEvents().subscribe({
      next: (events) => {
        // Filter events where event.Status is "Yes"
        this.events = events.filter((event: { Status: boolean }) => event.Status === true);
        this.filterEvents(); // Filter the events based on the selected chip
        this.loadAttendeeCounts(); // Fetch attendee counts after loading events
      },
      error: (error) => {
        console.error('Error fetching events:', error);
      }
    });
  }

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

  getAttendeeCount(eventId: string): number {
    return this.attendeeCounts[eventId] ?? 0; // Return 0 if count is not yet loaded
  }

  /**
   * Filter Events based on the Start Date
   */
  filterEvents(searchQuery: string = ''): void {
    let filteredEvents = this.events;
  
    // Apply chip-based filtering first
    switch (this.selectedChip) {
      case "Today's Event":
        filteredEvents = filteredEvents.filter(event => {
          const eventStartDate = event.StartDate ? new Date(event.StartDate) : null;
          const eventEndDate = event.EndDate ? new Date(event.EndDate) : eventStartDate;
          return (
            eventStartDate && eventEndDate &&
            this.datePipe!.transform(this.today, 'yyyy-MM-dd')! >= this.datePipe!.transform(eventStartDate, 'yyyy-MM-dd')! &&
            this.datePipe!.transform(this.today, 'yyyy-MM-dd')! <= this.datePipe!.transform(eventEndDate, 'yyyy-MM-dd')!
          );
        });
        break;
  
      case "This Week's Events":
        filteredEvents = filteredEvents.filter(event => {
          const eventDate = event.StartDate ? new Date(event.StartDate) : null;
          return eventDate && eventDate >= this.weekStart && eventDate <= this.weekEnd;
        });
        break;
  
      case "This Month's Events":
        filteredEvents = filteredEvents.filter(event => {
          const eventDate = event.StartDate ? new Date(event.StartDate) : null;
          return eventDate && eventDate >= this.monthStart && eventDate <= this.monthEnd;
        });
        break;
  
      case "All Events":
        filteredEvents = filteredEvents;
        break;
    }
  
    // Apply search-based filtering
    if (searchQuery) {
      filteredEvents = filteredEvents.filter(event =>
        event.Title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  
    this.filteredEvents = filteredEvents;
    this.sortEvents(); // Ensure events are sorted after filtering
  }
  
  
  
  

  sortEvents(): void {
    this.filteredEvents.sort((a, b) => {
      const dateA = new Date(a.StartDate).getTime();
      const dateB = new Date(b.StartDate).getTime();
      return this.sortAscending ? dateA - dateB : dateB - dateA;
    });
  }
}
