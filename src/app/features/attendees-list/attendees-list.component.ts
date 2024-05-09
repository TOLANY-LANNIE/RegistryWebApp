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

  displayedColumns = ['Name', 'Surname', 'PracticeNumber','Contact','Email','MoreOptions'];
  dataSource: MatTableDataSource<any>;
  searchString = '';
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  attendees: Guest[]=[];
  event:any;

  constructor(
    private dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    private service: AttendeesService,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbsService
  ) {
  }

  ngAfterViewInit() {
  
  }
  ngOnInit(){
    this.route.queryParams.subscribe(params => {
      const serializedData = params['data'];
      this.event = JSON.parse(serializedData);
      console.log(this.event);
    });

    const breadcrumbs = [
      { label: this.event.Title, url: '/Events/'+this.event.Title},
    ];
    this.breadcrumbService.setBreadcrumbs(breadcrumbs);
    this.loadDoctors();
    //this.getAttendeesForEvent(this.event.id);
  }

  async loadDoctors(): Promise<void> {
    try {
      this.attendees = await this.service.getAllAttendeesByEvent(this.event.id);
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
   /*  const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase(); */
  }

  edit(guest:any){

  }
  
  delete(guest:any){

  }
}


