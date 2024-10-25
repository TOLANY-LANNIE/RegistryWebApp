import {AfterViewInit, Component, ViewChild,ChangeDetectorRef} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {Sort, MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { Guest } from '../../models/guests.mode';
import { MatDialog } from '@angular/material/dialog';
import { AttendeesService } from '../../services/attendees/attendees.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbsService } from '../../services/breadcrumbs/breadcrumbs.service';
import { SendInviteComponent } from '../../modals/send-invite/send-invite.component';
import { AttendeeDetailsComponent } from '../../modals/attendee-details/attendee-details.component';
import { DeleteGuestComponent } from '../../modals/delete-guest/delete-guest.component';
import { Subscription } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { EventsService } from '../../services/events/events.service';
import { SearchService } from '../../services/search/search.service';

@Component({
  selector: 'app-attendees-list',
  templateUrl: './attendees-list.component.html',
  styleUrl: './attendees-list.component.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AttendeesListComponent implements AfterViewInit{

  displayedColumns = ['Test','Honorific','Name', 'Surname', 'PracticeNumber','Contact','Email','MoreOptions'];
  dataSource: MatTableDataSource<any>= new MatTableDataSource<any>();
  searchString = '';
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  attendees: Guest[]=[];
  event:any;
  eventDetails: any = {};
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;
  private attendeesSubscription: Subscription;
  private cdr: ChangeDetectorRef // Inject ChangeDetectorRef

  constructor(
    private dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    private service: AttendeesService,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbsService,
    private eventService:EventsService,
    private searchService: SearchService
  ) {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnInit(){
    this.route.queryParams.subscribe(params => {
      const serializedData = params['data'];
      this.event = JSON.parse(serializedData);
      if (this.event) {
        this.getEventDetails(this.event);
      }
    });

    this.loadAttendees();
    this.items = [
      { label: 'Events', routerLink: '/events' },
      { label: 'Attendees', routerLink: '/attendees' },
    ];
    this.home = { icon: 'pi pi-home', routerLink: '/events-board' };

     //Subscribe to the search service
     this.searchService.searchQuery$.subscribe(query => {
      this.applyFilter(query);
    });

  }

  ngOnDestroy(): void {
    if (this.attendeesSubscription) {
      this.attendeesSubscription.unsubscribe();
    }
  }

  async loadAttendees(): Promise<void> {
    this.attendeesSubscription = this.service.getAllAttendeesByEvent(this.event)
      .subscribe({
        next: (attendees: Guest[]) => {
          //console.log(attendees)
          this.attendees = attendees;
          this.dataSource = new MatTableDataSource(this.attendees);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: (error) => {
          console.error('Error loading attendees:', error);
          // Handle error, show error message, etc.
        }
      });
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  /**
   * Filters the content on the table based on the searchbox input
   * @param string 
   */
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openInviteModal() {
    const dialogRef = this.dialog.open(SendInviteComponent, {
      data: this.event,
      disableClose: true,
      panelClass: 'fullscreen-dialog',
      width: '500px',
    });
    dialogRef.afterClosed().subscribe(result => {
     // console.log(`Dialog result: ${result}`);
    });
  }
  

  edit(guest:any){

  }
  
  deleteGuest(guest:any){
    const dialogRef = this.dialog.open(DeleteGuestComponent, {
      data:guest,
      width: '250px',
    });
    dialogRef.afterClosed().subscribe(result => {
     // this.loadAttendees(); // Refresh events data after deleting attendee
    });
  }

  viewDetails(event:any){
    //console.log(event);
    const dialogRef = this.dialog.open(AttendeeDetailsComponent, {
      data:event,
      disableClose: true,
      panelClass: 'fullscreen-dialog',
      width: '500px',
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  /**
   * Create the Attendees Initials
   */
  getInitials(name: string, surname: string): string {
    const firstNameInitial = name ? name.charAt(0).toUpperCase() : '';
    const lastNameInitial = surname ? surname.charAt(0).toUpperCase() : '';
    return `${firstNameInitial}${lastNameInitial}`;
  }


  /**
   * Get Event Details based on the id
   */
 async getEventDetails(eventID:string){
  this.eventService.getEventById(eventID).subscribe(
    event => {
      this.eventDetails = event;
     // console.log(this.eventDetails);
    },
    error => {
      console.log( error.message);
    }
  );
}

}


