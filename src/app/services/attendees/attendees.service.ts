import { Injectable } from '@angular/core';
import { AngularFirestore, } from '@angular/fire/compat/firestore';
import { Guest } from '../../models/guests.mode';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AttendeesService {

  constructor(private db:AngularFirestore) { }

  getAllAttendees() {
    return new Promise<any>((resolve)=> {
      this.db.collection('Attendees').valueChanges({ idField: 'id' }).subscribe(events => resolve(events));
    })
  }
  addNewAttendee(guest:Guest): Promise<void> {
    return this.db.collection('Attendees').add(guest).then(() => {
      console.log('Doctor added successfully');
    }).catch(error => {
      console.error('Error adding doctor:', error);
      throw error;
    });
  }

  getAllAttendeesByEvent(eventId: string) {
    return new Promise<any>((resolve, reject) => {
      this.db.collection('Attendees', ref => ref.where('Event', '==', eventId)).valueChanges({ idField: 'id' }).subscribe({
        next: (attendees) => {
          resolve(attendees);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }
}
