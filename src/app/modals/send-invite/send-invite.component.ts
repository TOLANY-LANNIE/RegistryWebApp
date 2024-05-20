import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EventsService } from '../../services/events/events.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import emailjs from '@emailjs/browser';
import { EmailService } from '../../services/email-service/email-service.service';


@Component({
  selector: 'app-send-invite',
  templateUrl: './send-invite.component.html',
  styleUrl: './send-invite.component.scss',
})
export class SendInviteComponent {
   /**
    * Component FormGroup
   */
   addEventFormGroup!: FormGroup;

    //Event Details variables
    title ='';
    date  = '';
    description ='';
    location ='';
    capacity ='';
    status:boolean;

    constructor(
      private fb: FormBuilder,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<SendInviteComponent>,
      public dialog: MatDialog,
      private service:EventsService,
      private snackBar: MatSnackBar,
      private emailService: EmailService
    ){

    }

    ngOnInit(): void {
      this.addEventFormGroup= this.fb.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
      });

      console.log(this.data)
      console.log(this.emailService.generateRegistrationLink(this.data.id))
    }
  

    onCancel(){

    }

    async sendEmail(){
      emailjs.init("KDgLZCkmqFbxsdIxR");
      emailjs.send("service_lp2dh2j","template_7b3s4v1",{
        to_name: this.addEventFormGroup.value.name,
        event: this.data.Title,
        form_url: "http://localhost:4200/invite/events-board",
        from_name: "Registry App",
        reply_to: "thulani.mpofu2021@gmail.com",
        send_to: this.addEventFormGroup.value.email,
        });

      alert("Invitation Sent");
    }
    
}
