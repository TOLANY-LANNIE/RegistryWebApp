import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { EventsService } from '../../services/events/events.service';
import { AttendeesService } from '../../services/attendees/attendees.service';
import { AddEventComponent } from '../../modals/add-event/add-event.component';
import { EditEventComponent } from '../../modals/edit-event/edit-event.component';
import { DeleteAlertComponent } from '../../modals/delete-alert/delete-alert.component';
import { EventDetailsComponent } from '../../modals/event-details/event-details.component';
import { Subscription } from 'rxjs';
import { SearchService } from '../../services/search/search.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  providers: [DatePipe]
})
export class EventsComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['Title', 'Start Date', 'End Date', 'Capacity', 'Guests', 'Status', 'MoreOptions'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>(); // Initialize with type `any`
  panelOpenState = false;
  attendeeCounts: { [eventId: string]: number } = {}; // To store attendee counts
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;
  private eventsSubscription: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    private service: EventsService,
    private attendeesService: AttendeesService,
    private router: Router,
    private datePipe: DatePipe,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.subscribeToEvents(); // Subscribe to events and automatically update when changes occur
    this.items = [
      { label: 'Events' },
    ];
    this.home = { icon: 'pi pi-home', routerLink: '/events-board' };
    
    //Subscribe to the search service
    this.searchService.searchQuery$.subscribe(query => {
      this.applyFilter(query);
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    if (this.eventsSubscription) {
      this.eventsSubscription.unsubscribe();
    }
  }

  subscribeToEvents() {
    this.eventsSubscription = this.service.getAllEvents().subscribe({
      next: (events) => {
        this.dataSource.data = events;
        this.loadAttendeeCounts();
      },
      error: (error) => {
        console.error('Error fetching events:', error);
      }
    });
  }

  async loadAttendeeCounts() {
    for (const event of this.dataSource.data) {
      if (!event.id) {
        console.error('Missing Id for event:', event);
        continue;
      }
      try {
        const count = await this.attendeesService.getAttendeesCountByEvent(event.id);
        this.attendeeCounts[event.id] = count;
      } catch (error) {
        console.error('Error fetching attendee count for event ID', event.id, ':', error);
        this.attendeeCounts[event.id] = 0; // Handle the error appropriately
      }
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
  applyStatusFilter(activeStatus: boolean | null) {
    if (this.dataSource) {
      this.dataSource.filterPredicate = (data, filter) => {
        if (activeStatus === null) {
          return true; // Show all when no filter is selected
        } else {
          return data.Status === activeStatus;
        }
      };
      this.dataSource.filter = 'trigger'; // Trigger the filter
    }
  }

  applyDateFilter(date: Date | null) {
    if (this.dataSource) {
      this.dataSource.filterPredicate = (data, filter) => {
        if (!date) {
          return true; // Show all when no date filter is selected
        } else {
          // Assuming StartDate is in Date format, adjust comparison logic if needed
          return new Date(data.StartDate).toDateString() === date.toDateString();
        }
      };
      this.dataSource.filter = 'trigger'; // Trigger the filter
    }
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  openAddEventModal() {
    const dialogRef = this.dialog.open(AddEventComponent, {
      data: {},
      disableClose: true,
      panelClass: 'fullscreen-dialog',
      width: '500px',
    });
    dialogRef.afterClosed().subscribe(() => {
      //this.getEvents(); // Refresh events data after adding a new event
    });
  }

  openDeleteAlert(event: any) {
    const dialogRef = this.dialog.open(DeleteAlertComponent, {
      data: event,
      width: '250px',
    });
    dialogRef.afterClosed().subscribe(() => {
      //this.getEvents(); // Refresh events data after deleting an event
    });
  }

  openEditDialog(event: any) {
    const dialogRef = this.dialog.open(EditEventComponent, {
      data: event,
      disableClose: true,
      panelClass: 'fullscreen-dialog',
      width: '500px',
    });
    dialogRef.afterClosed().subscribe(() => {
      //this.getEvents(); // Refresh events data after editing an event
    });
  }

  viewDetails(event: any) {
    const dialogRef = this.dialog.open(EventDetailsComponent, {
      data: event,
      disableClose: true,
      panelClass: 'fullscreen-dialog',
      width: '500px',
    });
    dialogRef.afterClosed().subscribe(() => {
      //this.getEvents(); // Refresh events data after viewing details
    });
  }

  navigateToAttendees(event: any) {
    const serializedData = JSON.stringify(event.id);
    this.router.navigate(['/attendees'], { queryParams: { data: serializedData } });
  }

  getBadgeColor(status: boolean): string {
    return status ? '#75e900' : '#ff8d00';
  }

  getAttendeeCount(eventId: string): number {
    return this.attendeeCounts[eventId] ?? 0; // Return 0 if count is not yet loaded
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'MM/dd/yyyy') ?? '';
  }
}
