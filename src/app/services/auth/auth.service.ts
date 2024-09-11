import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { UserService } from '../users/users.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userData: any;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private userService: UserService // Inject UserService
  ) {
    // Subscribe to the authentication state
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        // Save user data and token in local storage
        user.getIdToken().then((token) => {
          localStorage.setItem('user', JSON.stringify(this.userData));
          localStorage.setItem('token', token);
          // Navigate to EventsBoardComponent if user is logged in
          this.router.navigate(['/events-board']);
        });
      } else {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
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
        // Save user data and token in local storage
        return result.user?.getIdToken().then((token) => {
          localStorage.setItem('user', JSON.stringify(this.userData));
          localStorage.setItem('token', token);
          // Navigate to EventsBoardComponent after successful login
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

        // Store additional user information in Firestore
        const userData = {
          uid: userId,
          email: email,
          fullName: fullName,
          createdAt: new Date()
        };

        if (userId) {
          return this.userService.addUser(userId, userData)
            .then(() => {
              // Save user data and token in local storage
              return result.user?.getIdToken().then((token) => {
                localStorage.setItem('user', JSON.stringify(this.userData));
                localStorage.setItem('token', token);
                // Navigate to EventsBoardComponent after successful signup
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
      localStorage.removeItem('user'); // Remove user data from local storage
      localStorage.removeItem('token'); // Remove token from local storage
      // Optionally navigate to the login page after logout
      this.router.navigate(['/auth/login']);
    });
  }
}
