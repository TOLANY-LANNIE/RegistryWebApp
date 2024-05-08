import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EventsService } from '../../services/events/events.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Event } from '../../models/event.model';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-send-invite',
  templateUrl: './send-invite.component.html',
  styleUrl: './send-invite.component.scss',
  providers: [DatePipe] 
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
      private datePipe: DatePipe,

    ){

    }

    ngOnInit(): void {
      this.addEventFormGroup= this.fb.group({
  
        title: ['', [Validators.required]],
        date: ['', [Validators.required]],
        description: ['', [Validators.required]],
        location: ['', [Validators.required]],
        capacity: ['', [Validators.required]],
        status:['', [Validators.required]],
      });
    }
  

    onCancel(){

    }

    onSubmit(): void {
      // Check if the addEventFormGroup is invalid, if it is, return early
      if (this.addEventFormGroup.invalid) {
        return;
      }
       // Getting data from the addEventFormGroup
    const formattedDate = this.datePipe.transform(this.addEventFormGroup.value.date, 'dd/MM/yyyy'); // Format date
      // Getting data from the addEventFormGroup
      const event: Event = {
        Title: this.addEventFormGroup.value.title,
        Date: formattedDate,
        Description: this.addEventFormGroup.value.description,
        Location: this.addEventFormGroup.value.location,
        Capacity: this.addEventFormGroup.value.capacity,
        Status: true
      };
    
      try {
        this.service.addNewEvent(event);
        console.log('Event added successfully');
        // Optionally, you can close the dialog or show a success message here
      } catch (error) {
        console.error('Error adding event:', error);
        // Handle error here, show error message or take appropriate action
      }
    }
    
}
