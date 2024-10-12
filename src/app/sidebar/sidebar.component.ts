import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { SessionService } from '../Services/session.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule], // Include CommonModule
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  // Track dropdown states
  dropdowns: { [key: string]: boolean } = {
    teachers: false,
    accounts: false
  };

  constructor(private sessionService: SessionService) {}

  // Toggle dropdown visibility
  toggleDropdown(name: string) {
    this.dropdowns[name] = !this.dropdowns[name];
  }

  // Check if dropdown is open
  isDropdownOpen(name: string): boolean {
    return this.dropdowns[name];
  }

  // Logout functionality
  logout() {
    this.sessionService.clearSession();
  }
}
