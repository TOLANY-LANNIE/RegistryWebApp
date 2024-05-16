import { Component, Input} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { EventsService } from '../../services/events/events.service';
import { AddEventComponent } from '../../modals/add-event/add-event.component';
import { Sort } from '@angular/material/sort';
import { EditEventComponent } from '../../modals/edit-event/edit-event.component';
import { DeleteAlertComponent } from '../../modals/delete-alert/delete-alert.component';
import { Router } from '@angular/router';
import { MatDialog} from '@angular/material/dialog';
import { EventDetailsComponent } from '../../modals/event-details/event-details.component';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss'
})
export class EventCardComponent {
  @Input() card: any;

  constructor(
    private dialog: MatDialog,
    private router:Router
  ) {}


  viewDetails(event:any){
    //console.log(event);
    const dialogRef = this.dialog.open(EventDetailsComponent, {
      data:event,
      disableClose: true,
      panelClass: 'fullscreen-dialog',
      width: '500px',
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  navigateToForm(event:any) {
    console.log(event.id);
    const eventId = event.id
    this.router.navigate(['/invite/registration'], { queryParams: { eventId } });
  }
}
