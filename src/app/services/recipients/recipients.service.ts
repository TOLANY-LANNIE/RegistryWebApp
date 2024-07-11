import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
@Injectable({
  providedIn: 'root'
})
export class RecipientsService {

  constructor(private db: AngularFirestore) {}


  
  addNew(recipient:any): Promise<void> {
    return this.db.collection('Recipients').add(recipient).then(() => {
    }).catch(error => {
      console.error('Error adding recipient:', error);
      throw error;
    });
  }

  getByGroupID(groupID:string) {
    return new Promise<any>((resolve, reject) => {
      this.db.collection('Recipients', ref => ref.where('GroupID', '==', groupID)).valueChanges({ idField: 'id' }).subscribe({
        next: (recipients) => {
          resolve(recipients);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }

  delete(recipient:string): Promise<void> {
    return this.db.collection('Recipients').doc(recipient).delete();
  }

  checkRecipientExists(email: string, groupId: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.db.collection('Recipients', ref => ref
        .where('GroupID', '==', groupId)
        .where('Email', '==', email)
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
