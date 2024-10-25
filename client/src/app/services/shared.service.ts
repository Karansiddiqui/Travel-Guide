import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor() {
    // Check if localStorage is available
    if (typeof localStorage !== 'undefined') {
      const user = localStorage.getItem('user');
      this.isLoggedInSubject.next(!!user);
    }
  }

  login(userEmail: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('user', userEmail);
      this.isLoggedInSubject.next(true);
    }
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('user');
      this.isLoggedInSubject.next(false);
    }
  }
}
