import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, NgIf, HttpClientModule],
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
    '/login', 
    '/registration',
    '/resetpassword'
    
  ];

  // Hide sidebar if the current URL starts with any of the specified routes
  this.hideSidebar = hideSidebarRoutes.some(route => url.startsWith(route));
}

  
}

