import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { EventsService } from '../../services/events/events.service';
import { AddEventComponent } from '../../modals/add-event/add-event.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements AfterViewInit {
  displayedColumns: string[] = ['Title', 'Date', 'Location', 'Capacity'];
  dataSource: MatTableDataSource<any>;
  searchString = '';
  panelOpenState = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    private service: EventsService
  ) {}

  ngAfterViewInit() {
    this.getEvents(); // Load events after view initialization
  }

  async getEvents() {
    try {
      const events = await this.service.getAllEvents();
      this.dataSource = new MatTableDataSource(events);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } catch (error) {
      console.error('Error fetching events:', error);
      // Handle the error appropriately
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
      if (result === true) {
        this.getEvents(); // Refresh events data after adding a new event
      }
    });
  }
}
