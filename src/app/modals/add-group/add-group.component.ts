import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EventsService } from '../../services/events/events.service';
import { ToastService } from '../../services/toast.service';
import emailjs from '@emailjs/browser';
import { MailGroupService } from '../../services/mail-group/mail-group.service';
import { MailGroup } from '../../models/mail-group.model';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrl: './add-group.component.scss',
})
export class AddGroupComponent {
   /**
    * Component FormGroup
   */
   addGroupFormGroup!: FormGroup;

    //Event Details variables
    name='';
    description='';

    constructor(
      private fb: FormBuilder,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<AddGroupComponent>,
      public dialog: MatDialog,
      private service:EventsService,
      private toastService: ToastService,
      private mailGroupService: MailGroupService
    ){

    }

    ngOnInit(): void {
      this.addGroupFormGroup= this.fb.group({
        name: ['', [Validators.required]],
        description: ['', [Validators.required]],
      });
    }
  

    onCancel(){

    }

    async onSubmit(){
      if(this.addGroupFormGroup.invalid){
        return
      }
     const group:MailGroup ={
       Name: this.addGroupFormGroup.value.name,
       Description: this.addGroupFormGroup.value.description
      }
      try{
        this.mailGroupService.addNew(group);
        this.showSuccessMessage(group.Name);
      }catch{
        this.showErrorMessage();
      }
    }

    showSuccessMessage(string: string) {
      this.toastService.showSuccess('Success', string + ' created successfully.');
    }
  
    /**
     * Failed to added the events to the Db 
     */
    showErrorMessage() {
      this.toastService.showError('Error', 'An error occurred during the operation.');
    }   
}
