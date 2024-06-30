import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AttendeesService } from '../../services/attendees/attendees.service';
import { ToastService } from '../../services/toast.service';

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
    private toastService: ToastService
  ){  }

  ngOnInit(): void {
    console.log(this.data)
  }

  onDelete(){
    this.service.delete(this.data.id)
    .then(() => {
      this.showSuccessMessage();
      this.dialogRef.close();
    })
    .catch(error => {
     this.showErrorMessage();
     this.dialogRef.close();  
    });
  }

  showSuccessMessage() {
    this.toastService.showSuccess('Success', 'Deleted successfully');
  }

  /**
   * Failed to added the events to the Db 
   */
  showErrorMessage() {
    this.toastService.showError('Error', 'An error occurred during the operation.');
  }

  
}
