import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Recipient } from '../../models/recipient';
@Injectable({
  providedIn: 'root'
})
export class RecipientsService {

  constructor(private db: AngularFirestore) {}

  getAllRecipients() {
    return new Promise<any>((resolve) => {
      this.db.collection('Recipients').valueChanges({ idField: 'id' }).subscribe(events => resolve(events));
    });
  }
  
  addNew(recipient:any): Promise<void> {
    return this.db.collection('Recipients').add(recipient).then(() => {
    }).catch(error => {
      //console.error('Error adding recipient:', error);
      throw error;
    });
  }

  getRecipient(groupID: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      // Adding some logging to understand where it might fail
      //console.log(`Fetching recipients for group ID: ${groupID}`);
      
      this.db.collection('Recipients', ref => ref.where('Group', '==', groupID))
        .valueChanges({ idField: 'id' })
        .subscribe({
          next: (recipients) => {
            if (recipients.length > 0) {
              //console.log(`Recipients found:`, recipients);
              resolve(recipients);
            } else {
             // console.log('No recipients found for the given group ID.');
              resolve([]); // Return an empty array if no recipients found
            }
          },
          error: (error) => {
            //console.error('Error fetching recipients:', error);
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

  updateRecipient(recipientId: string,recipientData:Recipient): Promise<void> {
     return this.db.doc(`Recipients/${recipientId}`).update(recipientData);
   }
}
