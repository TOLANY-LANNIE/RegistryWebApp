import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { UserService } from '../users/users.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userData: any; // Holds user data

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private userService: UserService
  ) {
    // Subscribe to the authentication state
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        // Save user data and token in local storage
        user.getIdToken().then((token) => {
          localStorage.setItem('user', JSON.stringify(this.userData));
          localStorage.setItem('token', token);
          localStorage.setItem('uid', user.uid); // Store the user UID
          this.router.navigate(['/events-board']);
        });
      } else {
        this.clearLocalStorage();
      }
    });
  }

  // Getter to check whether the user is logged in
  get isLoggedIn(): boolean {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return user !== null && token !== null;
  }

  // Login method
  login(email: string, password: string): Promise<void> {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.userData = result.user;
        return result.user?.getIdToken().then((token) => {
          localStorage.setItem('user', JSON.stringify(this.userData));
          localStorage.setItem('token', token);
          localStorage.setItem('uid', result.user?.uid || ''); // Store the user UID
          this.router.navigate(['/events-board']);
        });
      });
  }

  // Signup method
  signUp(email: string, password: string, fullName: string): Promise<void> {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.userData = result.user;
        const userId = result.user?.uid;

        const userData = {
          uid: userId,
          email: email,
          fullName: fullName,
          createdAt: new Date()
        };

        if (userId) {
          return this.userService.addUser(userId, userData)
            .then(() => {
              return result.user?.getIdToken().then((token) => {
                localStorage.setItem('user', JSON.stringify(this.userData));
                localStorage.setItem('token', token);
                localStorage.setItem('uid', userId); // Store the user UID
                this.router.navigate(['/events-board']);
              });
            });
        }
        return Promise.reject('User ID not found');
      });
  }

  // Logout method
  logout(): Promise<void> {
    return this.afAuth.signOut().then(() => {
      this.userData = null;
      this.clearLocalStorage();
      this.router.navigate(['/auth/login']);
    });
  }

  // Method to send a password reset email
  sendPasswordResetEmail(email: string): Promise<void> {
    return this.afAuth.sendPasswordResetEmail(email);
  }

  // Method to get the current user's UID
  getCurrentUserUid(): string {
    const uid = localStorage.getItem('uid');
    if (!uid) {
      throw new Error('User is not authenticated'); // Explicit error if user isn't authenticated
    }
    return uid;
  }

  // Utility method to clear local storage on logout or when user is not authenticated
  private clearLocalStorage(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('uid');
  }
}
