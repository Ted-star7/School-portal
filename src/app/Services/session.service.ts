import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  constructor() {}

   public saveToken(token: string): void {
    try {
      const expirationTime = Date.now() + 60 * 60 * 1000; // 60 minutes from now
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('tokenExpiration', expirationTime.toString());
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

  public saveuserName(userName: string): void{
    try {
      sessionStorage.setItem('userName', userName);
    } catch (error){
      console.error('Error saving userNmae')
    }
  }

  public savepfpUrl(pfpUrl: string): void{
    try{
      sessionStorage.setItem('pfpUrl', pfpUrl)
    }catch (error){
      console.error('Error saving pfpUrl')
    }
  }

  public getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  public getUserId(): string | null {
    return sessionStorage.getItem('userId');
  }
  public getuserName(): string | null{
    return sessionStorage.getItem('userName')
  }
  public getpfpUrl(): string | null{
    return sessionStorage.getItem('pfpUrl')
  }

  
  public isLoggedIn(): boolean {
    const token = this.getToken();
    const expiration = this.getTokenExpiration();
    // Check if the token exists and is not expired
    return !!token && (expiration ? Date.now() < +expiration : true);
  }

  public getTokenExpiration(): string | null {
    return sessionStorage.getItem('tokenExpiration');
  }
  
  public clearSession(): void {
    // Clear all session items including expiration
    try {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('userId');
      sessionStorage.removeItem('userName');
      sessionStorage.removeItem('pfpUrl');
      sessionStorage.removeItem('tokenExpiration');
    } catch (error) {
      console.error('Error clearing session storage:', error);
    }
  }
}
