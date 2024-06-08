import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AttendeesService } from '../../services/attendees/attendees.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete-guest',
  templateUrl: './delete-guest.component.html',
  styleUrl: './delete-guest.component.scss'
})
export class DeleteGuestComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DeleteGuestComponent>,
    public dialog: MatDialog,
    private service:AttendeesService,
    private snackBar: MatSnackBar,
  ){  }

  ngOnInit(): void {
    console.log(this.data)
  }

  onDelete(){
    this.service.delete(this.data.id)
    .then(() => {
     
      this.snackBar.open('Attendee deleted successfully', 'Close', {
        duration: 5000,
        panelClass: ['success'],
      });
      // Optionally, update your UI or reload data
    })
    .catch(error => {
      //console.error('Error deleting event:', error);
      this.snackBar.open('Error deleting Attendee. Please try again later.', 'Close', {
        duration: 5000,
        panelClass: ['error'],
      });
      // Handle error, show error message, etc.
    });
  }
}
