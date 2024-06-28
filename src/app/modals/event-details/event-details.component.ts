import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EventsService } from '../../services/events/events.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss',
  providers: [DatePipe]
})
export class EventDetailsComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EventDetailsComponent>,
    public dialog: MatDialog,
    private service:EventsService,
    private datePipe: DatePipe
  ){  }

  ngOnInit(): void {
    //console.log(this.data)
  }

  formatDate(date: string): string {
    // Convert date to 'MM/dd/yyyy'
    return this.datePipe.transform(date, 'MM/dd/yyyy') ?? '';
  }
}
