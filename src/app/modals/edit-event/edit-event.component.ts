import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EventsService } from '../../services/events/events.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Event } from '../../models/event.model';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrl: './edit-event.component.scss',
  providers: [DatePipe] 
})
export class EditEventComponent {

  /**
    * Component FormGroup
   */
  editEventFormGroup!: FormGroup;

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
    public dialogRef: MatDialogRef<EditEventComponent>,
    public dialog: MatDialog,
    private service:EventsService,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe,
  ){  }

  ngOnInit(): void {
    this.editEventFormGroup= this.fb.group({

      title: ['', [Validators.required]],
      date: ['', [Validators.required]],
      description: ['', [Validators.required]],
      location: ['', [Validators.required]],
      capacity: ['', [Validators.required]],
      status:['', [Validators.required]],
    });
    this.editEventFormGroup.setValue({
      date: this.data.Date,
      status: this.data.Status
    })
  }


  onCancel(){

  }

  onSubmit(): void {
    // Check if the editEventFormGroup is invalid, if it is, return early
    if (this.editEventFormGroup.invalid) {
      return;
    }
  
    // Getting data from the editEventFormGroup
    const formattedDate = this.datePipe.transform(this.editEventFormGroup.value.date, 'dd/MM/yyyy'); // Format date
    // Getting data from the editEventFormGroup
    const event: Event = {
      Title: this.editEventFormGroup.value.title,
      Date: formattedDate,
      Description: this.editEventFormGroup.value.description,
      Location: this.editEventFormGroup.value.location,
      Capacity: this.editEventFormGroup.value.capacity,
      Status: JSON.parse(this.editEventFormGroup.value.status)
    };
  
    this.service.updateEvent(this.data.id, event)
      .then(() => {
        this.snackBar.open('Event updated successfully', 'Close', {
          duration: 2000, // Duration in milliseconds
        });
      })
      .catch(error => {
        this.snackBar.open('Error updating event', 'Close', {
          duration: 2000, // Duration in milliseconds
        });
        //console.error('Error updating event:', error);
        // Optionally, you can handle the error here, such as displaying a message to the user
      });
  }
  
}
