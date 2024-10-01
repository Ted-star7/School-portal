import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Services/auth.service'; // Adjust the import path as needed
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-session-expiration-notification',
  standalone: true,
  imports: [NgIf],
  template: `
    <div *ngIf="isExpired" class="notification">
      <p>Your session has expired. Please <a routerLink="/login">login</a> again.</p>
    </div>
  `,
  styleUrls: ['./session-expiration-notification.component.css'], // Add your styles
})
export class SessionExpirationNotificationComponent implements OnInit {
  isExpired = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.sessionExpired$.subscribe(() => {
      this.isExpired = true; // Set isExpired to true when the session expires
    });
  }
}
