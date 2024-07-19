import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RecipientsService } from '../../services/recipients/recipients.service';
import { ToastService } from '../../services/toast.service';
import { Recipient } from '../../models/recipient';


@Component({
  selector: 'app-edit-recipient',
  templateUrl: './edit-recipient.component.html',
  styleUrl: './edit-recipient.component.scss',
})
export class EditRecipientComponent implements OnInit {
  editRecipientFormGroup!: FormGroup;
  originalData: any; // To store the original data
  
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditRecipientComponent>,
    private service: RecipientsService,
   private toastService: ToastService,
  ) {
    console.log(data)
  }

  ngOnInit(): void {
    // Initialize the form group with form controls including agenda
    this.editRecipientFormGroup = this.fb.group({
      name: [this.data.Title, [Validators.required]],
      surname: [this.data.StartDate, [Validators.required]],
      email: [this.data.EndDate, [Validators.required, Validators.email]],
    });

    // Make a copy of the original data for comparison
    this.originalData = { ...this.data };

    // Ensure form changes are tracked
    this.editRecipientFormGroup.valueChanges.subscribe(() => {
      // Optionally, perform other actions on value change
    });
  }

 
  // Method to determine if the form has been changed
  isChanged(): boolean {
    const formValues = this.editRecipientFormGroup.value;
    const originalValues = {
      name: this.originalData.Name,
      surname: this.originalData.Surname,
      email: this.originalData.Email,
      group: this.originalData.Group,
    };

    // Check if the main form values have changed
    if (
      formValues.name !== originalValues.name ||
      formValues.suraname !== originalValues.surname ||
      formValues.email !== originalValues.email
    ) {
      return true;
    } 
   return false;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.editRecipientFormGroup.invalid || !this.isChanged()) {
      return;
    }

    const formValues = this.editRecipientFormGroup.value;
    const recipient:Recipient = {
      Name: formValues.name,
      Surname: formValues.surname,
      Email: formValues.email,
      Group: formValues.group,
    };

    this.service.updateRecipient(this.data.id,recipient)
      .then(() => {
      this.showSuccessMessage();
        this.dialogRef.close();
      })
      .catch(error => {
        this.showErrorMessage();
       // console.error('Error updating event:', error);
      }); 
  }

  showSuccessMessage() {
    this.toastService.showSuccess('Success', 'Updated successfully');
  }

  /**
   * Failed to added the events to the Db 
   */
  showErrorMessage() {
    this.toastService.showError('Error', 'An error occurred during the operation.');
  }

  
}
