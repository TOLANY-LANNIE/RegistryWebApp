import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AttendeesService } from '../../services/attendees/attendees.service';

@Component({
  selector: 'app-attendee-details',
  templateUrl: './attendee-details.component.html',
  styleUrl: './attendee-details.component.scss'
})
export class AttendeeDetailsComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AttendeeDetailsComponent>,
    public dialog: MatDialog,
    private service:AttendeesService,
  ){  }

  ngOnInit(): void {
    console.log(this.data)
  }
}
