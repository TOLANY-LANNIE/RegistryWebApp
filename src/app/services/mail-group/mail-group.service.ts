import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MailGroup } from '../../models/mail-group.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MailGroupService {

  constructor(private db: AngularFirestore, private authService: AuthService) { }

  getAll(): Promise<any[]> {
    const userId = localStorage.getItem('uid'); // Fetch the uid from localStorage
    return new Promise<any[]>((resolve) => {
      this.db.collection('Mail-Group', ref => ref.where('uid', '==', userId))
        .valueChanges({ idField: 'id' })
        .subscribe(groups => resolve(groups));
    });
  }

  addNew(mailGroup: MailGroup): void {
    const userId = localStorage.getItem('uid'); // Get the uid of the current user
    this.db.collection('Mail-Group').add({
      uid: userId, // Include the uid field
      Name: mailGroup.Name,
      Description: mailGroup.Description
    });
  }

  update(groupId: string, groupData: any): Promise<void> {
    return this.db.doc(`Mail-Group/${groupId}`).update(groupData);
  }

  delete(groupId: string): Promise<void> {
    return this.db.collection('Mail-Group').doc(groupId).delete();
  }

  getById(groupId: string): Observable<MailGroup> {
    return this.db.collection('Mail-Group').doc<MailGroup>(groupId).valueChanges()
      .pipe(
        map(group => {
          if (!group) {
            throw new Error(`Mail-Group with ID ${groupId} not found`);
          }
          return group;
        })
      );
  }
}
