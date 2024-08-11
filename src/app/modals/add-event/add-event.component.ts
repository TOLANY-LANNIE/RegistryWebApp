import { Component, Inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EventsService } from '../../services/events/events.service';
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
  addEventFormGroup!: FormGroup;
  @Input() min: any;
  todayDate: Date = new Date(); // Today's date

  // Image upload details
  fileName: string = '';
  imagePreview: string | ArrayBuffer | null = null;
  bannerFile: File | null = null;

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
    private toastService: ToastService
  ) {
    // Ensure the date is set to midnight to avoid time zone issues
    this.todayDate.setHours(0, 0, 0, 0);
  }

  ngOnInit(): void {
    this.addEventFormGroup = this.fb.group({
      title: ['', [Validators.required]],
      startDate: ['', [Validators.required, this.startDateValidator.bind(this)]],
      endDate: ['', [Validators.required, this.endDateValidator.bind(this)]],
      description: ['', [Validators.required]],
      location: ['', [Validators.required]],
      capacity: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      status: ['', [Validators.required]],
      agenda: this.fb.array([]), // Initialize agenda FormArray
      banner: ['', [Validators.required]] // Banner FormControl with required validation
    });

    // Update endDate validator when startDate changes
    this.addEventFormGroup.get('startDate')?.valueChanges.subscribe(() => {
      this.addEventFormGroup.get('endDate')?.updateValueAndValidity();
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

  startDateValidator(control: any) {
    if (!control.value) return null;
    const startDate = new Date(control.value);
    return startDate < this.todayDate ? { pastDate: true } : null;
  }

  endDateValidator(control: any) {
    if (!control.value) return null;
    const endDate = new Date(control.value);
    const startDate = new Date(this.addEventFormGroup.get('startDate')?.value);
    return endDate < this.todayDate ? { pastDate: true } : endDate < startDate ? { invalidEndDate: true } : null;
  }

  // Function to handle the file selection
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.bannerFile = input.files[0];
      this.fileName = this.bannerFile.name;
      this.addEventFormGroup.patchValue({ banner: this.bannerFile });

      // Create a file reader to preview the image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.bannerFile);
    }
  }

  onSubmit(): void {
    if (this.addEventFormGroup.invalid) {
      return;
    }
  
    const event = {
      Title: this.addEventFormGroup.value.title,
      StartDate: new Date(this.addEventFormGroup.value.startDate).toISOString(),
      EndDate: new Date(this.addEventFormGroup.value.endDate).toISOString(),
      Description: this.addEventFormGroup.value.description,
      Location: this.addEventFormGroup.value.location,
      Capacity: this.addEventFormGroup.value.capacity,
      Status: this.addEventFormGroup.value.status,
      Agenda: this.addEventFormGroup.value.agenda.map((a: { item: string }) => a.item),
    };
  
    this.service.addNewEvent(event, this.addEventFormGroup.value.banner)
      .subscribe(() => {
        this.showSuccessMessage();
        this.dialogRef.close();
      }, (error) => {
        this.showErrorMessage();
      });
  }
  

  onCancel(): void {
    this.dialogRef.close();
  }

  /**
   * Event added successfully message 
   */
  showSuccessMessage() {
    this.toastService.showSuccess('Success', 'Event added successfully');
  }

  /**
   * Failed to add the events to the Db 
   */
  showErrorMessage() {
    this.toastService.showError('Error', 'An error occurred during the operation.');
  }
}
