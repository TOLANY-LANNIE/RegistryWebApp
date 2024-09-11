import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private firestore: AngularFirestore) {}

  // Method to add user information to Firestore
  addUser(userId: string, userData: any): Promise<void> {
    return this.firestore.collection('Users').doc(userId).set(userData);
  }
}
