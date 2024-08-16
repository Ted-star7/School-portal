import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  constructor() {}

  public saveToken(token: string): void {
    try {
      sessionStorage.setItem('token', token);
    } catch (error) {
      console.error('Error saving token in session storage:', error);
    }
  }

  public saveUserId(userId: string): void {
    try {
      sessionStorage.setItem('userId', userId);
    } catch (error) {
      console.error('Error saving userId in session storage:', error);
    }
  }

  public getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  public getUserId(): string | null {
    return sessionStorage.getItem('userId');
  }

  public clearSession(): void {
    try {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('userId');
    } catch (error) {
      console.error('Error clearing session storage:', error);
    }
  }

  public isLoggedIn(): boolean {
    // Check if the token exists and is not expired
    const token = this.getToken();
    // Implement your token validation logic here if necessary
    return !!token;
  }
}
