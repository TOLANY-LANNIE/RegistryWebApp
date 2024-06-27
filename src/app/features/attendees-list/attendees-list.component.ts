import {AfterViewInit, Component, ViewChild} from '@angular/core';
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
import { MenuItem } from 'primeng/api';
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
  dataSource: MatTableDataSource<any>;
  searchString = '';
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  attendees: Guest[]=[];
  event:any;
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  constructor(
    private dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    private service: AttendeesService,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbsService
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
      //console.log(this.event);
    });

    this.loadDoctors();
    //this.getAttendeesForEvent(this.event.id);

    this.items = [
      { label: 'Events', routerLink: '/events' },
      { label: 'Attendees', routerLink: '/attendees' },
    ];
    this.home = { icon: 'pi pi-home', routerLink: '/events-board' };
  }

  async loadDoctors(): Promise<void> {
    try {
      this.attendees = await this.service.getAllAttendeesByEvent(this.event);
      console.log(this.attendees)
      this.dataSource = new MatTableDataSource(this.attendees);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log(this.dataSource.data)
    } catch (error) {
      console.error('Error loading doctors:', error);
      // Handle error, show error message, etc.
    }
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
   * @param event 
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
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
      console.log(`Dialog result: ${result}`);
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
      this.loadDoctors(); // Refresh events data after deleting attendee
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
}


