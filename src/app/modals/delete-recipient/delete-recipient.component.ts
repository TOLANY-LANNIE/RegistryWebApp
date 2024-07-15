import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RecipientsService } from '../../services/recipients/recipients.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-delete-recipient',
  templateUrl: './delete-recipient.component.html',
  styleUrl: './delete-recipient.component.scss'
})
export class DeleteRecipientComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DeleteRecipientComponent>,
    public dialog: MatDialog,
    private service:RecipientsService,
    private toastService: ToastService
  ){  }

  ngOnInit(): void {
    //console.log(this.data)
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
