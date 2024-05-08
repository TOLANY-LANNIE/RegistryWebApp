import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EventsService } from '../../services/events/events.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Event } from '../../models/event.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit-attendee',
  standalone: true,
  imports: [],
  templateUrl: './edit-attendee.component.html',
  styleUrl: './edit-attendee.component.scss'
})
export class EditAttendeeComponent {

}
