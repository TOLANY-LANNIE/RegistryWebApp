import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RecipientsService } from '../../services/recipients/recipients.service';
import { ToastService } from '../../services/toast.service';
import { Recipient } from '../../models/recipient';

@Component({
  selector: 'app-edit-recipient',
  templateUrl: './edit-recipient.component.html',
  styleUrls: ['./edit-recipient.component.scss'],
})
export class EditRecipientComponent implements OnInit {
  editRecipientFormGroup!: FormGroup;
  originalData: any; // To store the original data
  formChanged = false; // To track form changes
  
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditRecipientComponent>,
    private service: RecipientsService,
    private toastService: ToastService,
  ) {
    console.log(data);
  }

  ngOnInit(): void {
    // Initialize the form group with form controls
    this.editRecipientFormGroup = this.fb.group({
      name: [this.data.Name, [Validators.required]],
      surname: [this.data.Surname, [Validators.required]],
      email: [this.data.Email, [Validators.required, Validators.email]],
    });

    // Make a copy of the original data for comparison
    this.originalData = { ...this.data };

    // Ensure form changes are tracked
    this.editRecipientFormGroup.valueChanges.subscribe(() => {
      this.formChanged = this.isChanged();
    });
  }

  // Method to determine if the form has been changed
  isChanged(): boolean {
    const formValues = this.editRecipientFormGroup.value;
    const originalValues = {
      name: this.originalData.Name,
      surname: this.originalData.Surname,
      email: this.originalData.Email,
    };

    return (
      formValues.name !== originalValues.name ||
      formValues.surname !== originalValues.surname ||
      formValues.email !== originalValues.email
    );
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.editRecipientFormGroup.invalid || !this.formChanged) {
      return;
    }

    const formValues = this.editRecipientFormGroup.value;
    const recipient: Recipient = {
      Name: formValues.name,
      Surname: formValues.surname,
      Email: formValues.email,
      Group: this.data.Group,
    };

    this.service.updateRecipient(this.data.id, recipient)
      .then(() => {
        this.showSuccessMessage();
        this.dialogRef.close();
      })
      .catch(error => {
        this.showErrorMessage();
        // console.error('Error updating recipient:', error);
      });
  }

  showSuccessMessage() {
    this.toastService.showSuccess('Success', 'Updated successfully');
  }

  showErrorMessage() {
    this.toastService.showError('Error', 'An error occurred during the operation.');
  }
}
