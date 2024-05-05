import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {MatTableDataSource} from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import {Sort, MatSort} from '@angular/material/sort';
import { EventsService } from '../../services/events/events.service';
import { AddEventComponent } from '../../modals/add-event/add-event.component';
@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent implements AfterViewInit  {
  displayedColumns: string[] = ['Title','Date','Location', 'Capacity'];
  dataSource: MatTableDataSource<any>
  searchString ='';
  panelOpenState = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  /**
   * constructor
   */
  constructor(
    private dialog:MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    private service: EventsService){}


  /**
   * This method is called after the component's view has been initialized.
   * It is used to set the paginator for the dataSource, enabling pagination functionality.
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async ngOnInit() {
    await this.getEvents(); // Call getEvents during initialization
  }

  /**
   * get all Events fun*
   */
  async getEvents() {
    try {
      const events = await this.service.getAllEvents();
     
      this.dataSource = new MatTableDataSource(events);
      console.log(this.dataSource.data);
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      // Handle the error appropriately, e.g., show a message to the user
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

   /** 
   * Announce the change in sort state for assistive technology.
   */
   announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  /**
   * Opens the Add Category Dialog
   */
  openAddEventModal(){
    const dialogRef = this.dialog.open(AddEventComponent,{
      data: {},
      disableClose: true,
      panelClass: 'fullscreen-dialog',
      width: '500px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
