import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MailGroup } from '../../models/mail-group.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { group } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})

@Injectable({
  providedIn: 'root'
})
export class MailGroupService {

  constructor(private db: AngularFirestore) { }

  getAll() {
    return new Promise<any>((resolve)=> {
      this.db.collection('Mail-Group').valueChanges({ idField: 'id' }).subscribe(groups => resolve(groups));
    })
  }
  addNew(mailGroup: MailGroup): void {
    this.db.collection('Mail-Group').add({
      Name: mailGroup.Name,
      Description: mailGroup.Description
    })
  }

  update(groupId: string, groupData: Event): Promise<void> {
   // return this.db.collection('Events').doc(eventId).update(eventData);
    return this.db.doc(`Mail-Group/${groupId}`).update(groupData);
  }

  delete(groupId: string): Promise<void> {
    return this.db.collection('Mail-Group').doc(groupId).delete();
  }

  getById(eventId: string): Observable<Event> {
    return this.db.collection('Mail-Group').doc<Event>(eventId).valueChanges()
      .pipe(
        map(event => {
          if (!event) {
            throw new Error(`Mail-Group with ID ${eventId} not found`);
          }
          return event;
        })
      );
  }
}
