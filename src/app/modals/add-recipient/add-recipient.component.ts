import { Component, Inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RecipientsService } from '../../services/recipients/recipients.service';
import { Event } from '../../models/event.model';
import { DatePipe } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { Recipient } from '../../models/recipient';

@Component({
  selector: 'app-add-recipient',
  templateUrl: './add-recipient.component.html',
  styleUrls: ['./add-recipient.component.scss'],
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None,
})
export class AddRecipientComponent implements OnInit {
  addRecipientFormGroup!: FormGroup;
  groupID:string;

  // Recipient Details variables
  name = '';
  surname = '';
  email = '';
  group= '';
  
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddRecipientComponent>,
    public dialog: MatDialog,
    private service: RecipientsService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.addRecipientFormGroup = this.fb.group({
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      group: [this.data.id, [Validators.required]],
    });
  }

 

 

  onSubmit(): void {
    if (this.addRecipientFormGroup.invalid) {
      return;
    }
    const recipient: Recipient = {
      Name: this.addRecipientFormGroup.value.name,
      Surname: this.addRecipientFormGroup.value.surname,
      Email: this.addRecipientFormGroup.value.email,
      Group: this.data.id
    }; 
    try{
      this.service.addNew(recipient);
      this.showSuccessMessage();
    }catch{
      this.showErrorMessage();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  /**
   * Event added successfully message 
   */
  showSuccessMessage() {
    this.toastService.showSuccess('Success', 'Recipient added successfully');
  }

  /**
   * Failed to added the events to the Db 
   */
  showErrorMessage() {
    this.toastService.showError('Error', 'An error occurred during the operation.');
  }
}
