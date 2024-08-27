import { Component, HostListener } from '@angular/core';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { MenuItem } from 'primeng/api';
import { EventsService } from '../../services/events/events.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { EventDetailsComponent } from '../../modals/event-details/event-details.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  providers: [DatePipe]
})
export class CalendarComponent {
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;
  calendarOptions: CalendarOptions;

  constructor(
    private eventService: EventsService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
  ) {
    this.setCalendarOptions();
  }

  ngOnInit() {
    // Breadcrumbs
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
        id: event.id
      }));
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.setCalendarOptions();
  }

  setCalendarOptions() {
    const isSmallScreen = window.innerWidth < 768; // Adjust the width as needed

    this.calendarOptions = {
      initialView:isSmallScreen ? 'listWeek':'dayGridMonth',
      height: 'auto',
      contentHeight: 'auto',
      aspectRatio: 1.35,
      plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
      headerToolbar: {
        left: isSmallScreen ? 'title' : 'prev today next',
        center:isSmallScreen ?'today':'title',
        right: isSmallScreen ? 'prev,next' : 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      },
      eventClick: (arg) => this.handleDateClick(arg),
      editable: true,
      nowIndicator: true,
      events: [],
      navLinks: true,
    };
  }

  viewDetails(event: any) {
    const dialogRef = this.dialog.open(EventDetailsComponent, {
      data: event,
      disableClose: true,
      panelClass: 'fullscreen-dialog',
      width: '500px',
    });
    dialogRef.afterClosed().subscribe(result => { });
  }

  handleDateClick(arg: EventClickArg) {
    this.getEventDetails(arg.event.id);
  }

  async getEventDetails(eventID: string) {
    this.eventService.getEventById(eventID).subscribe(
      event => {
        this.viewDetails(event);
      },
      error => {
        console.log(error.message);
      }
    );
  }

  formatDate(date: string): string {
    // Convert date to 'MM/dd/yyyy'
    return this.datePipe.transform(date, 'yyyy-MM-dd') ?? '';
  }
}
