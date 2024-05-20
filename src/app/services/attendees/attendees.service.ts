import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Guest } from '../../models/guests.mode';

@Injectable({
  providedIn: 'root'
})
export class AttendeesService {

  constructor(private db: AngularFirestore) { }

  getAllAttendees() {
    return new Promise<any>((resolve) => {
      this.db.collection('Attendees').valueChanges({ idField: 'id' }).subscribe(events => resolve(events));
    });
  }

  addNewAttendee(guest: Guest): Promise<void> {
    return this.db.collection('Attendees').add(guest).then(() => {
      console.log('Guest added successfully');
    }).catch(error => {
      console.error('Error adding guest:', error);
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
}