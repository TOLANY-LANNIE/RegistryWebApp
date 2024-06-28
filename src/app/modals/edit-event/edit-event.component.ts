import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EventsService } from '../../services/events/events.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Event } from '../../models/event.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss'],
  providers: [DatePipe]
})
export class EditEventComponent implements OnInit {
  editEventFormGroup!: FormGroup;
  originalData: any; // To store the original data

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditEventComponent>,
    private service: EventsService,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe,
  ) {}

  ngOnInit(): void {
    // Initialize the form group
    this.editEventFormGroup = this.fb.group({
      title: [this.data.Title, [Validators.required]],
      startDate: [this.data.StartDate, [Validators.required]],
      endDate: [this.data.EndDate, [Validators.required]],
      description: [this.data.Description, [Validators.required]],
      location: [this.data.Location, [Validators.required]],
      capacity: [this.data.Capacity, [Validators.required, Validators.pattern('^[0-9]*$')]],
      status: [this.data.Status, [Validators.required]]
    });

    // Make a copy of the original data for comparison
    this.originalData = { ...this.data };

    // Ensure form changes are tracked
    this.editEventFormGroup.valueChanges.subscribe(() => {
      // Optionally, perform other actions on value change
    });
  }

  // Method to determine if the form has been changed
  isChanged(): boolean {
    // We are comparing the initial data to the form values to see if there are any changes.
    const formValues = this.editEventFormGroup.value;
    const originalValues = {
      title: this.originalData.Title,
      startDate: this.originalData.StartDate,
      endDate: this.originalData.EndDate,
      description: this.originalData.Description,
      location: this.originalData.Location,
      capacity: this.originalData.Capacity,
      status: this.originalData.Status,
    };

    return JSON.stringify(formValues) !== JSON.stringify(originalValues);
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.editEventFormGroup.invalid || !this.isChanged()) {
      return;
    }

    const formValues = this.editEventFormGroup.value;
    const event: Event = {
      Title: formValues.title,
      StartDate: formValues.startDate,
      EndDate: formValues.endDate,
      Description: formValues.description,
      Location: formValues.location,
      Capacity: formValues.capacity,
      Status: formValues.status,
      Agenda: this.data.Agenda // Assuming Agenda is part of data
    };

    this.service.updateEvent(this.data.id, event)
      .then(() => {
        this.snackBar.open('Event updated successfully', 'Close', {
          duration: 5000,
          panelClass: ['success'],
        });
        this.dialogRef.close();
      })
      .catch(error => {
        this.snackBar.open('Error updating event', 'Close', {
          duration: 5000,
          panelClass: ['error'],
        });
        console.error('Error updating event:', error);
      });
  }
}
