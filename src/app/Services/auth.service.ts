import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { SessionService } from './session.service'; 

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public sessionExpired$ = new Subject<void>(); // Observable to notify about session expiration

  constructor(private sessionService: SessionService, private ngZone: NgZone) {
    this.checkSessionExpiration();
  }
 isLoggedIn(): boolean {
    return this.sessionService.isLoggedIn(); // Reuse the logic from SessionService
  }
  private checkSessionExpiration(): void {
    setInterval(() => {
      if (!this.sessionService.isLoggedIn()) {
        this.ngZone.run(() => {
          this.sessionExpired$.next(); // Emit expiration event
        });
      }
    }, 1000); // Check every second
  }
}
