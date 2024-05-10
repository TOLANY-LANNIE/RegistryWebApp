import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private router: Router) { }

  generateRegistrationLink(eventId: string): string {
    // Generate URL tree with the desired route and parameters
    const urlTree = this.router.createUrlTree(['/invite/registration/'], { queryParams: { eventId } });

    // Convert URL tree to string
    const url = this.router.serializeUrl(urlTree);

    return 'http://localhost:4200'+url;
  }
}
