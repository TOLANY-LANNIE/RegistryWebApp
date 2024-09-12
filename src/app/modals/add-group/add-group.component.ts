import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EventsService } from '../../services/events/events.service';
import { ToastService } from '../../services/toast.service';
import emailjs from '@emailjs/browser';
import { MailGroupService } from '../../services/mail-group/mail-group.service';
import { MailGroup } from '../../models/mail-group.model';
import { AuthService } from '../../services/auth/auth.service';

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
      private mailGroupService: MailGroupService,
      private authService: AuthService
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
      const uid = this.authService.getCurrentUserUid();
      if (uid) {
        const group: MailGroup = {
          Name: this.addGroupFormGroup.value.name,
          Description: this.addGroupFormGroup.value.description,
          uid: uid
        };
        try {
          this.mailGroupService.addNew(group);
          this.showSuccessMessage(group.Name);
        } catch {
          this.showErrorMessage();
        }
      } else {
        // Handle the case where UID is null (e.g., show an error message or redirect)
        this.showAuthErrorMessage();
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

    /*
    * Failed to added the events to the Db 
    */
   showAuthErrorMessage() {
     this.toastService.showError('Error', 'User is not authenticated');
   } 
}
