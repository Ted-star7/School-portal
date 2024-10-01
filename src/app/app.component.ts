import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SessionExpirationNotificationComponent } from "./session-expiration-notification/session-expiration-notification.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, NgIf, HttpClientModule, SessionExpirationNotificationComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'School-portal';
  hideSidebar: boolean = false;

  constructor(private router: Router) {} 

  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.checkRoute(event.urlAfterRedirects);
      }
    });
  }

checkRoute(url: string) {
  const hideSidebarRoutes = [
    '/',            
    '/login', 
    '/registration',
    '/resetpassword',
  ];

  
  this.hideSidebar = hideSidebarRoutes.includes(url);
}

  
}

