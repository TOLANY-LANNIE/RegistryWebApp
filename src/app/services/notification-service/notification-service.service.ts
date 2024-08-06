import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Notification } from '../../models/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$: Observable<Notification[]> = this.notificationsSubject.asObservable();

  constructor(private db: AngularFirestore) {
    this.loadNotifications(); // Load notifications on service initialization
  }

  private loadNotifications(): void {
    this.db.collection<Notification>('Notifications').valueChanges({ idField: 'id' })
      .pipe(
        map(notifications => notifications.filter(notification => !notification.Hide))
      )
      .subscribe(
        notifications => this.notificationsSubject.next(notifications),
        error => console.error('Error fetching notifications:', error)
      );
  }

  addNotification(notification: Notification): void {
    this.db.collection('Notifications').add({
      Date: notification.Date,
      Message: notification.Message,
      Read: notification.Read,
      Hide: notification.Hide,
      User: notification.User
    });
  }

  updateNotification(nId: string, notificationData: Notification): Promise<void> {
    return this.db.collection('Notifications').doc(nId).update(notificationData);
  }

  /**
   * Detects updates or changes to the Notifications Collection
   * @returns 
   */
  detectChanges(): Observable<Notification[]> {
    return this.db.collection<Notification>('Notifications').valueChanges({ idField: 'id' })
      .pipe(
        map(notifications => notifications.filter(notification => !notification.Hide))
      );
  }

  /**
   * Marks the notification as Read
   * @param notificationId 
   * @returns 
   */
  markAsRead(notificationId: string): Promise<void> {
    return this.db.collection('Notifications').doc(notificationId).update({ Read: true });
  }

  /**
   * Hides the notification from displaying in the list
   * @param notificationId 
   * @returns 
   */
  markAsHidden(notificationId: string): Promise<void> {
    return this.db.collection('Notifications').doc(notificationId).update({ Hide: true });
  }


  delete(eventId: string): Promise<void> {
    return this.db.collection('Notifications').doc(eventId).delete();
  }
}
