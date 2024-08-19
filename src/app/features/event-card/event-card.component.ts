import { Component, Input, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EventDetailsComponent } from '../../modals/event-details/event-details.component';
import { UnsplashService } from '../../services/unsplash/unsplash.service';
import { DatePipe } from '@angular/common';
import { animate } from "motion";

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
  providers: [DatePipe] 
})
export class EventCardComponent implements OnInit, AfterViewInit {
  @Input() card: any;
  @Input() attendeeCount: number; // New input to receive attendee count
  @ViewChild('attendeeCountElement') attendeeCountElement: ElementRef; // ViewChild to access the attendee count element
  photo: any = null;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private unsplashService: UnsplashService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.searchPhoto();
  }

  ngAfterViewInit(): void {
    this.animateAttendeeCount();
  }

  viewDetails(event: any) {
    const dialogRef = this.dialog.open(EventDetailsComponent, {
      data: event,
      disableClose: true,
      panelClass: 'fullscreen-dialog',
      width: '500px',
    });
    dialogRef.afterClosed().subscribe(result => {});
  }

  navigateToForm(event: any) {
    const eventId = event.id;
    this.router.navigate(['/invite/registration'], { queryParams: { eventId } });
  }

  searchPhoto(): void {
    const query = this.card.Title; // Use card title as the search query
    this.unsplashService.searchPhotos(query, 1, 1).subscribe(response => {
      if (response.results && response.results.length > 0) {
        this.photo = response.results[0];
      } else {
        this.photo = null; // Handle the case when no photos are found
      }
    }, error => {
      console.error('Error fetching photo from Unsplash:', error);
      this.photo = null; // Handle error case
    });
  }

  formatDate(date: string): string {
    // Convert date to 'MM/dd/yyyy'
    return this.datePipe.transform(date, 'MM/dd/yyyy') ?? '';
  }

  /**
   * Get percentage of confirmed Attendees
   */
  getProgressPercentage(attendeeCount: number, capacity: number): number {
    if (capacity === 0) {
      return 0; // Prevent division by zero
    }
    return (attendeeCount / capacity) * 100;
  }
  
  /**
   *  Navigate to attendee component
   * @param event 
   */
  navigateToAttendees(event: any) {
    const serializedData = JSON.stringify(event.id);
    this.router.navigate(['/attendees'], { queryParams: { data: serializedData } });
  }

  /**
   * Animate attendeeCount using Motion One
   */
  animateAttendeeCount(): void {
    animate(this.attendeeCountElement.nativeElement, {
      scale: [1, 1.2, 1], // Scale up and down
      opacity: [0, 1], // Fade in
      transformOrigin: 'center', // Transform origin
    }, {
      duration: 0.5, // 0.5 seconds
      easing: 'ease-in-out', // Ease in-out animation
    });
  }
}
