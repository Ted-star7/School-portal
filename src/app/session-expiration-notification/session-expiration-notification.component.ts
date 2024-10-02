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
      <p *ngIf="isLoading">Loading...</p> <!-- Loading effect -->
    </div>
  `,
  styleUrls: ['./session-expiration-notification.component.css'],
})
export class SessionExpirationNotificationComponent implements OnInit {
  isExpired = false;
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Subscribe to session expiration event
    this.authService.sessionExpired$.subscribe(() => {
      if (this.authService.isLoggedIn()) {
        this.isExpired = true; // Show notification only if user is still logged in but session expired
      }
    });
  }

  redirectToLogin(): void {
    this.isLoading = true;

    // Delay for loading effect before redirecting
    setTimeout(() => {
      // Redirect to login page and hide notification
      this.router.navigate(['/login']);
    }, 1000); // Adjust delay as needed
  }
}
