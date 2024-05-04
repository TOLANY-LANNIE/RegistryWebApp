import { Injectable } from '@angular/core';
import { AngularFirestore,DocumentReference } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Event } from '../../models/event.model';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private db: AngularFirestore) { }

  getAllEvents() {
    return new Promise<any>((resolve)=> {
      this.db.collection('Events').valueChanges({ idField: 'id' }).subscribe(events => resolve(events));
    })
  }

  // Method to add a new event to Firebase
  addEvent(event: Event): Promise<DocumentReference<Event>> {
    // Add event data to the 'events' collection
    return this.db.collection<Event>('events').add(event);
  }

  // Method to get all events from Firebase
  getEvents(): Observable<Event[]> {
    return this.db.collection<Event>('events').valueChanges();
  }

  // Method to get event by ID from Firebase
  getEventById(eventId: string): Observable<Event> {
    return this.db.doc<Event>(`events/${eventId}`).valueChanges()
      .pipe(
        filter((event: any) => !!event) // Filter out undefined events
      );
  }

  // Method to update an existing event in Firebase
  updateEvent(eventId: string, eventData: Event): Promise<void> {
    return this.db.doc(`events/${eventId}`).update(eventData);
  }

  // Method to delete an event from Firebase
  deleteEvent(eventId: string): Promise<void> {
    return this.db.doc(`events/${eventId}`).delete();
  }

}
