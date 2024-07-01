import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EventsService } from '../../services/events/events.service';
import { ToastService } from '../../services/toast.service';
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
  @Input() min: any;
  todayDate:Date = new Date(); //today's date
  
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditEventComponent>,
    private service: EventsService,
   private toastService: ToastService,
  ) {
    this.todayDate.setDate(this.todayDate.getDate() + 0);
  }

  ngOnInit(): void {
    // Initialize the form group with form controls including agenda
    this.editEventFormGroup = this.fb.group({
      title: [this.data.Title, [Validators.required]],
      startDate: [this.data.StartDate, [Validators.required]],
      endDate: [this.data.EndDate, [Validators.required]],
      description: [this.data.Description, [Validators.required]],
      location: [this.data.Location, [Validators.required]],
      capacity: [this.data.Capacity, [Validators.required, Validators.pattern('^[0-9]*$')]],
      status: [this.data.Status, [Validators.required]],
      agenda: this.fb.array([]) // Initialize agenda as a FormArray
    });

    // Make a copy of the original data for comparison
    this.originalData = { ...this.data };

    // Populate the agenda form array with the initial data
    if (this.data.Agenda && Array.isArray(this.data.Agenda)) {
      this.data.Agenda.forEach((item: string) => {
        this.addAgendaItem(item);
      });
    }

    // Ensure form changes are tracked
    this.editEventFormGroup.valueChanges.subscribe(() => {
      // Optionally, perform other actions on value change
    });
  }

  // Getter for the agenda form array
  get agenda(): FormArray {
    return this.editEventFormGroup.get('agenda') as FormArray;
  }

  // Method to add a new agenda item
  addAgendaItem(item: string = ''): void {
    this.agenda.push(this.fb.group({
      item: [item, Validators.required]
    }));
  }

  // Method to remove an agenda item by index
  removeAgendaItem(index: number): void {
    this.agenda.removeAt(index);
  }

  // Method to determine if the form has been changed
  isChanged(): boolean {
    const formValues = this.editEventFormGroup.value;
    const originalValues = {
      title: this.originalData.Title,
      startDate: this.originalData.StartDate,
      endDate: this.originalData.EndDate,
      description: this.originalData.Description,
      location: this.originalData.Location,
      capacity: this.originalData.Capacity,
      status: this.originalData.Status,
      agenda: this.originalData.Agenda // Include agenda in comparison
    };

    // Check if the main form values have changed
    if (
      formValues.title !== originalValues.title ||
      formValues.startDate !== originalValues.startDate ||
      formValues.endDate !== originalValues.endDate ||
      formValues.description !== originalValues.description ||
      formValues.location !== originalValues.location ||
      formValues.capacity !== originalValues.capacity ||
      formValues.status !== originalValues.status
    ) {
      return true;
    }

    // Check if the agenda items have changed
    const currentAgendaItems = formValues.agenda.map((a: { item: string }) => a.item);
    if (JSON.stringify(currentAgendaItems) !== JSON.stringify(originalValues.agenda)) {
      return true;
    }

    return false;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.editEventFormGroup.invalid || !this.isChanged()) {
      return;
    }

    const formValues = this.editEventFormGroup.value;
    const event: Event = {
      Title: formValues.title,
      StartDate: formValues.startDate.toISOString(),
      EndDate: formValues.endDate.toISOString(),
      Description: formValues.description,
      Location: formValues.location,
      Capacity: formValues.capacity,
      Status: formValues.status,
      Agenda: formValues.agenda.map((a: { item: string }) => a.item) // Map agenda to simple array
    };

    this.service.updateEvent(this.data.id, event)
      .then(() => {
      this.showSuccessMessage();
        this.dialogRef.close();
      })
      .catch(error => {
        this.showErrorMessage();
       // console.error('Error updating event:', error);
      });
  }

  showSuccessMessage() {
    this.toastService.showSuccess('Success', 'Updated successfully');
  }

  /**
   * Failed to added the events to the Db 
   */
  showErrorMessage() {
    this.toastService.showError('Error', 'An error occurred during the operation.');
  }

  
}
