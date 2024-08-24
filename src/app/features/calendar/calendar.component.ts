import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { MenuItem } from 'primeng/api';
import { EventsService } from '../../services/events/events.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  providers: [DatePipe] 
})
export class CalendarComponent {
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin,listPlugin],  
    headerToolbar: {
      left: 'prev today next',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek' 
    },
    dateClick: (arg) => this.handleDateClick(arg),
    editable: true,
    nowIndicator: true,
    events: [],
    navLinks:true,
  };
  
  constructor(
    private eventService:EventsService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {

    //Breadcrumbs
    this.items = [
      { label: 'Calendar', routerLink: '/calendar' },
    ];
    this.home = { icon: 'pi pi-home', routerLink: '/events-board' };


     // Load events from the service
     this.eventService.getAllEvents().subscribe((events) => {
      this.calendarOptions.events = events.map(event => ({
        title: event.Title,
        start: this.formatDate(event.StartDate),
        end: this.formatDate(event.EndDate),
      }));
    });
    
  }

  handleDateClick(arg: DateClickArg) {
    alert('date click! ' + arg.dateStr);
  }

  formatDate(date: string): string {
    // Convert date to 'MM/dd/yyyy'
    return this.datePipe.transform(date, 'yyyy-MM-dd') ?? '';
  }
}
