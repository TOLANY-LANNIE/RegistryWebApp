import { Component, Inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EventsService } from '../../services/events/events.service';
import { Event } from '../../models/event.model';
import { DatePipe } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss'],
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None,
})
export class AddEventComponent implements OnInit {
  /**
   * Component FormGroup
   */
  addEventFormGroup!: FormGroup;
  @Input() min: any;
  todayDate:Date = new Date(); //today's date
  // Event Details variables
  title = '';
  startDate = '';
  endDate = '';
  description = '';
  location = '';
  capacity = '';
  status!: boolean;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddEventComponent>,
    public dialog: MatDialog,
    private service: EventsService,
    private toastService:ToastService
  ) {
    this.todayDate.setDate(this.todayDate.getDate() + 0);
  }

  ngOnInit(): void {
    this.addEventFormGroup = this.fb.group({
      title: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      description: ['', [Validators.required]],
      location: ['', [Validators.required]],
      capacity: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      status: ['', [Validators.required]],
      agenda: this.fb.array([]) // Initialize agenda FormArray
    });
  }

  get agenda(): FormArray {
    return this.addEventFormGroup.get('agenda') as FormArray;
  }

  createAgendaItem(): FormGroup {
    return this.fb.group({
      item: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  addAgendaItem(): void {
    this.agenda.push(this.createAgendaItem());
  }

  removeAgendaItem(index: number): void {
    this.agenda.removeAt(index);
  }

  onSubmit(): void {
    if (this.addEventFormGroup.invalid) {
      return;
    }
    const event:Event = {
      Title: this.addEventFormGroup.value.title,
      StartDate: this.addEventFormGroup.value.startDate.toISOString(),
      EndDate: this.addEventFormGroup.value.endDate.toISOString(),
      Description: this.addEventFormGroup.value.description,
      Location: this.addEventFormGroup.value.location,
      Capacity: this.addEventFormGroup.value.capacity,
      Status: this.addEventFormGroup.value.status,
      Agenda: this.addEventFormGroup.value.agenda.map((a: { item: string }) => a.item) // Map agenda items
    };

    try {
      this.service.addNewEvent(event);
      this.showSuccessMessage();
    } catch (error) {
     this.showErrorMessage();
    }
  }

  onCancel(): void {
    // Handle the cancel action here
  }


  /**
   * Event added successfully message 
   */
  showSuccessMessage() {
    this.toastService.showSuccess('Success', 'Event added successfully');
  }

  /**
   * Failed to added the events to the Db 
   */
  showErrorMessage() {
    this.toastService.showError('Error', 'An error occurred during the operation.');
  }
}
