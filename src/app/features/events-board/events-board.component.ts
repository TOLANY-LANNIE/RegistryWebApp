import { Component } from '@angular/core';
import { EventsService } from '../../services/events/events.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-events-board',
  templateUrl: './events-board.component.html',
  styleUrl: './events-board.component.scss'
})
export class EventsBoardComponent {
events:any[]=[];

  constructor(
    private service: EventsService,
    private router: Router
  ) {}

  ngOnInit(){
    this.getEvents(); // Load events after view initialization
  }

  async getEvents() {
    try {
      // Fetch events from the service
      const events = await this.service.getAllEvents();
  
      // Filter events where event.Status is "Yes"
      this.events = events.filter((event: { Status: boolean; }) => event.Status === true);
    } catch (error) {
      console.error('Error fetching events:', error);
      // Handle the error appropriately
    }
  }
  
}
