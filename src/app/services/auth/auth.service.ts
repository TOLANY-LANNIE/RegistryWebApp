import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userData: any;

  constructor(private afAuth: AngularFireAuth, private router: Router) {
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
