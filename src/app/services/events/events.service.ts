import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private db: AngularFirestore, private storage: AngularFireStorage) { }

  getAllEvents(): Observable<any[]> {
    return this.db.collection('Events').valueChanges({ idField: 'id' });
  }
  
  addNewEvent(event: any, bannerFile: File): Observable<void> {
    const eventRef = this.db.collection('Events').doc().ref;
    const filePath = `event-banners/${eventRef.id}_${bannerFile.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, bannerFile);

    return new Observable(observer => {
      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            const eventData = {
              Title: event.Title,
              StartDate: event.StartDate,
              EndDate: event.EndDate,
              Description: event.Description,
              Location: event.Location,
              Capacity: event.Capacity,
              Status: event.Status,
              Agenda: event.Agenda,
              BannerUrl: url // Store the download URL in Firestore
            };
            eventRef.set(eventData).then(() => {
              observer.next();
              observer.complete();
            }).catch(error => {
              observer.error(error);
            });
          });
        })
      ).subscribe();
    });
  }

  updateEvent(eventId: string, eventData:any): Promise<void> {
    return this.db.doc(`Events/${eventId}`).update(eventData);
  }

  delete(eventId: string): Promise<void> {
    return this.db.collection('Events').doc(eventId).delete();
  }

  getEventById(eventId: string): Observable<Event> {
    return this.db.collection('Events').doc<Event>(eventId).valueChanges()
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
