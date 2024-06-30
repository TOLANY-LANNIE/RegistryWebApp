import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EventsService } from '../../services/events/events.service';
import { ToastService } from '../../services/toast.service';

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
    private toastService: ToastService
  ){  }

  ngOnInit(): void {
    console.log(this.data.id)
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

  /**
   * Deleted successfully message 
   */
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
