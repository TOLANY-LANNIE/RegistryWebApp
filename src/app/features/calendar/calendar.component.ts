import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { MenuItem } from 'primeng/api';
import { EventsService } from '../../services/events/events.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']  // Corrected styleUrls
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
    events: [
      { title: ' Test Event 1', date: '2024-08-12' },
      { title: ' Test Event 2', date: '2024-08-23' }
    ]
  };

  constructor(
    private eventService:EventsService
  ) {}

  ngOnInit() {
    this.items = [
      { label: 'Calendar', routerLink: '/calendar' },
    ];
    this.home = { icon: 'pi pi-home', routerLink: '/events-board' };
  }

  handleDateClick(arg: DateClickArg) {
    alert('date click! ' + arg.dateStr);
  }
}
