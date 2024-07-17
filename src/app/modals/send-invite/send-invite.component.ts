import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EventsService } from '../../services/events/events.service';
import { ToastService } from '../../services/toast.service';
import emailjs from '@emailjs/browser';
import { EmailService } from '../../services/email-service/email-service.service';
import { RecipientsService } from '../../services/recipients/recipients.service';
import { MailGroupService } from '../../services/mail-group/mail-group.service';

@Component({
  selector: 'app-send-invite',
  templateUrl: './send-invite.component.html',
  styleUrls: ['./send-invite.component.scss'],
})
export class SendInviteComponent implements OnInit {
  /**
   * Component FormGroup
   */
  addEventFormGroup!: FormGroup;

  // Event Details variables
  title = '';
  date = '';
  description = '';
  location = '';
  capacity = '';
  status: boolean;
  event:any;

  // Send To selection
  sendTo: string = 'individual'; // Default to 'individual'
  mailGroups: any[] = [];

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SendInviteComponent>,
    public dialog: MatDialog,
    private service: EventsService,
    private recipientsService: RecipientsService,
    private toastService: ToastService,
    private emailService: EmailService,
    private mailGroupService: MailGroupService,
  ) { }

  ngOnInit(): void {
    this.addEventFormGroup = this.fb.group({
      sendTo: ['individual', Validators.required],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mailGroup: ['']
    });

    this.onSendToChange(this.sendTo);
    this.getMailGroups();
    this.getEventDetails();
  }

  async getMailGroups() {
    try {
      this.mailGroups = await this.mailGroupService.getAll();
    } catch (error) {
      console.error('Error fetching mail groups:', error);
    }
  }

  getEventDetails() {
    this.service.getEventById(this.data).subscribe({
      next: (event) => {
        this.event = event;
        console.log('Event Details:', this.event);
      },
      error: (error) => {
        console.error('Error fetching Event Details:', error);
      }
    });
  }

  onSendToChange(sendTo: string): void {
    this.sendTo = sendTo;
    if (sendTo === 'individual') {
      this.addEventFormGroup.get('fullName')?.setValidators([Validators.required]);
      this.addEventFormGroup.get('email')?.setValidators([Validators.required, Validators.email]);
      this.addEventFormGroup.get('mailGroup')?.clearValidators();
    } else {
      this.addEventFormGroup.get('fullName')?.clearValidators();
      this.addEventFormGroup.get('email')?.clearValidators();
      this.addEventFormGroup.get('mailGroup')?.setValidators([Validators.required]);
    }
    this.addEventFormGroup.get('fullName')?.updateValueAndValidity();
    this.addEventFormGroup.get('email')?.updateValueAndValidity();
    this.addEventFormGroup.get('mailGroup')?.updateValueAndValidity();
  }

  onCancel() {
    this.dialogRef.close();
  }

  async sendEmail() {
    emailjs.init("KDgLZCkmqFbxsdIxR");
    if (this.sendTo === 'individual') {
      emailjs.send("service_lp2dh2j", "template_7b3s4v1", {
        Title: this.event.Title,
        RecipientName: this.addEventFormGroup.value.fullName,
        StartDate:this.event.StartDate,
        EndDate: this.event.EndDate,
        Location:this.event.Location,
        Capacity: this.event.Capacity,
        Description:this.event.Description,
        this:this.event.Agenda,
        RegistrationLink: this.emailService.generateRegistrationLink(this.data),
        ContactInformation: "0112345678",
        SenderName: "Registry App",
        SenderTitle: "Event Planner",
        SenderOrganization: "Registry",
        SenderContactInformation: "012 345 6789",
        CurrentYear: "2024",
        event: "Test Event",
        reply_to: "thulani.mpofu@outlook.com",
        send_to: this.addEventFormGroup.value.email
      }).then(() => {
        this.showSuccessMessage(this.addEventFormGroup.value.fullName);
      }).catch(() => {
        this.showErrorMessage();
      });
    } else {
      // Handle sending email to the selected mail group
      const selectedGroup = this.mailGroups.find(group => group.id === this.addEventFormGroup.value.mailGroup);
      if (selectedGroup) {
        try {
          const recipients = await this.recipientsService.getRecipient(selectedGroup.id);
          for (const recipient of recipients) {
            emailjs.send("service_lp2dh2j","template_7b3s4v1",{
              Title: this.event.Title,
              RecipientName: recipient.Name + " " + recipient.Surname,
              StartDate:this.event.StartDate,
              EndDate: this.event.EndDate,
              Location:this.event.Location,
              Capacity: this.event.Capacity,
              Description:this.event.Description,
              this:this.event.Agenda,
              RegistrationLink: this.emailService.generateRegistrationLink(this.data),
              ContactInformation: "0112345678",
              SenderName: "Registry App",
              SenderTitle: "Event Planner",
              SenderOrganization: "Registry",
              SenderContactInformation: "012 345 6789",
              CurrentYear: "2024",
              event: "Test Event",
              reply_to: "thulani.mpofu@outlook.com",
              send_to: recipient.Email,
              }).then(() => {
              this.showSuccessMessage(selectedGroup.name);
            }).catch(() => {
              this.showErrorMessage();
            });
          }
        } catch (error) {
          console.error('Error sending emails to group:', error);
          this.showErrorMessage();
        }
      }
    }
  }

  showSuccessMessage(name: string) {
    this.toastService.showSuccess('Success', 'Invitation Sent to ' + name);
  }

  showErrorMessage() {
    this.toastService.showError('Error', 'An error occurred during the operation.');
  }
}
