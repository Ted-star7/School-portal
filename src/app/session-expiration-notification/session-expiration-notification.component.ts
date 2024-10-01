import { Component, OnInit } from '@angular/core'; 
import { AuthService } from '../Services/auth.service'; 
import { Router } from '@angular/router'; 
import { NgIf } from '@angular/common'; 

@Component({
  selector: 'app-session-expiration-notification',
  standalone: true,
  imports: [NgIf],
  template: `
    <div *ngIf="isExpired" class="notification">
      <p>Your session has expired.</p>
      <button (click)="redirectToLogin()" class="redirect-button">Okay, redirect to login</button>
    </div>
  `,
  styleUrls: ['./session-expiration-notification.component.css'], 
})
export class SessionExpirationNotificationComponent implements OnInit {
  isExpired = false;
  isLoading = false; 

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.sessionExpired$.subscribe(() => {
      this.isExpired = true; // Set isExpired to true when the session expires
    });
  }

  redirectToLogin(): void {
    this.isLoading = true; 
    setTimeout(() => {
      this.router.navigate(['/login']); 
    }, 1000); // Adjust the delay as necessary
  }
}
