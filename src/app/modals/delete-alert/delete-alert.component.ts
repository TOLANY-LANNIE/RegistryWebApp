import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EventsService } from '../../services/events/events.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-delete-alert',
  templateUrl: './delete-alert.component.html',
  styleUrl: './delete-alert.component.scss'
})
export class DeleteAlertComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DeleteAlertComponent>,
    public dialog: MatDialog,
    private service:EventsService,
    private snackBar: MatSnackBar,
  ){  }

  ngOnInit(): void {
    console.log(this.data.id)
  }

  onDelete(){
    this.service.deleteEvent(this.data.id)
    .then(() => {
      this.snackBar.open('Event deleted successfully', 'Close', { duration: 3000 });
      // Optionally, update your UI or reload data
    })
    .catch(error => {
      console.error('Error deleting event:', error);
      this.snackBar.open('Error deleting event. Please try again later.', 'Close', { duration: 3000 });
      // Handle error, show error message, etc.
    });
  }
}
