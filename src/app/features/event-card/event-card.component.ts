import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EventDetailsComponent } from '../../modals/event-details/event-details.component';
import { UnsplashService } from '../../services/unsplash/unsplash.service';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss']
})
export class EventCardComponent implements OnInit {
  @Input() card: any;
  @Input() attendeeCount: number; // New input to receive attendee count
  photo: any = null;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private unsplashService: UnsplashService
  ) {}

  ngOnInit(): void {
    this.searchPhoto();
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
}
