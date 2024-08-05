import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Notification } from '../../models/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {


  constructor(private db: AngularFirestore) {
  }

  getAllNotifications() {
    return new Promise<any>((resolve)=> {
      this.db.collection('Notifications').valueChanges({ idField: 'id' }).subscribe(notifications => resolve(notifications));
    })
  }
  addNotification(notification:Notification): void {
    this.db.collection('Notifications').add({
      Date: notification.Date,
      Message:notification.Message,
      Read: notification.Read,
      Hide: notification.Hide,
      User: notification.User
    })
  }

 
  updateNotification(nId: string, notificationData: Notification): Promise<void> {
   // return this.db.collection('Events').doc(eventId).update(eventData);
    return this.db.doc(`Events/${nId}`).update(notificationData);
  }




  detectChanges(): Observable<any[]> {
    return this.db.collection('Attendees').valueChanges({ idField: 'id' });
  }

}

