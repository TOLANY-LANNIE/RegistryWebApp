import { Injectable } from '@angular/core';
import { AngularFirestore, } from '@angular/fire/compat/firestore';
import { Event } from '../../models/event.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
  addNewEvent(event: Event): void {
    this.db.collection('Events').add({
      Title: event.Title,
      StartDate:event.StartDate,
      EndDate: event.EndDate,
      Description: event.Description,
      Location: event.Location,
      Capacity: event.Capacity,
      Status: event.Status,
      Agenda: event.Agenda,
      //Image: event.Image,
    })
  }

  updateEvent(eventId: string, eventData: Event): Promise<void> {
   // return this.db.collection('Events').doc(eventId).update(eventData);
    return this.db.doc(`Events/${eventId}`).update(eventData);
  }

  delete(eventId: string): Promise<void> {
    return this.db.collection('Events').doc(eventId).delete();
  }

  getEventById(eventId: string): Observable<Event> {
    return this.db.collection('events').doc<Event>(eventId).valueChanges()
      .pipe(
        map(event => {
          if (!event) {
            throw new Error(`Event with ID ${eventId} not found`);
          }
          return event;
        })
      );
  }
}
