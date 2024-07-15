import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private collection: AngularFirestoreCollection<any>;

  constructor(private firestore: AngularFirestore) {
    this.collection = this.firestore.collection('Attendees');
  }

  getItems(): Observable<any[]> {
    return this.collection.valueChanges({ idField: 'id' });
  }
}
