import { Component, Inject,ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EventsService } from '../../services/events/events.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Event } from '../../models/event.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrl: './add-event.component.scss',
  providers: [DatePipe] ,
  encapsulation: ViewEncapsulation.None,
})
export class AddEventComponent {
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
      public dialogRef: MatDialogRef<AddEventComponent>,
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
      if (this.addEventFormGroup.invalid) {
        return;
      }
    
      const formattedDate = this.datePipe.transform(this.addEventFormGroup.value.date, 'dd/MM/yyyy');
      const event: Event = {
        Title: this.addEventFormGroup.value.title,
        Date: formattedDate,
        Description: this.addEventFormGroup.value.description,
        Location: this.addEventFormGroup.value.location,
        Capacity: this.addEventFormGroup.value.capacity,
        Status: this.addEventFormGroup.value.status,
      };
      console.log(this.addEventFormGroup.value.status)    
      try {
        this.service.addNewEvent(event);
        this.snackBar.open('Event added successfully', 'Close',{
          duration: 5000,
          panelClass: ['success'],
        });
      } catch (error) {
        //console.error('Error adding event:', error);
        
        this.snackBar.open('Error adding event', 'Close',{
          duration: 5000,
          panelClass: ['error'],
        });
      }
    }
    
}
