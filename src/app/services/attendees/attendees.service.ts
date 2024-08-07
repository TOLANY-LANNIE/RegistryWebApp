import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Guest } from '../../models/guests.mode';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AttendeesService {
  private attendeesSubject = new BehaviorSubject<Guest[]>([]);
  attendees$: Observable<Guest[]> = this.attendeesSubject.asObservable();
  
  
  constructor(private db: AngularFirestore) { }

  addNewAttendee(guest: Guest): Promise<void> {
    return this.db.collection('Attendees').add(guest).then(() => {
      console.log('Guest added successfully');
    }).catch(error => {
      console.error('Error adding guest:', error);
      throw error;
    });
  }

  private loadAttendeesByEvent(eventId: string): void {
    this.db.collection<Notification>('Attendees', ref => ref.where('Event', '==', eventId))
      .valueChanges({ idField: 'id' })
      .pipe(
        map((attendees: any[]) => attendees.filter(attendee => attendee.Event === eventId))
      )
      .subscribe({
        next: attendees => this.attendeesSubject.next(attendees),
        error: error => console.error('Error fetching attendees:', error)
      });
  }

  /**
   * Get all attendees by event ID as an Observable.
   */
  getAllAttendeesByEvent(eventId: string): Observable<Guest[]> {
    this.loadAttendeesByEvent(eventId);
    return this.attendees$;
  }
  
  

  delete(eventId: string): Promise<void> {
    return this.db.collection('Attendees').doc(eventId).delete();
  }

  checkGuestExists(practiceNumber: string, contact: string, email: string, eventId: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.db.collection('Attendees', ref => ref
        .where('PracticeNumber', '==', practiceNumber)
        .where('Contact', '==', contact)
        .where('Email', '==', email)
        .where('Event', '==', eventId)
      ).get().subscribe(snapshot => {
        if (snapshot.empty) {
          resolve(false);
        } else {
          resolve(true);
        }
      }, error => {
        reject(error);
      });
    });
  }

  
  getAttendeesCountByEvent(eventId: string): Promise<number> {
    if (!eventId) {
      return Promise.reject('Invalid event ID'); // Check for invalid ID
    }
    return new Promise<number>((resolve, reject) => {
      this.db.collection('Attendees', ref => ref.where('Event', '==', eventId)).valueChanges().subscribe({
        next: (attendees) => {
          resolve(attendees.length); // Return the count of attendees
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }
  
  
}
