import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { SessionService } from '../Services/session.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule], 
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

 
  toggleDropdown(name: string) {
    this.dropdowns[name] = !this.dropdowns[name];
  }

  
  isDropdownOpen(name: string): boolean {
    return this.dropdowns[name];
  }

  
  logout() {
    this.sessionService.clearSession();
  }
}
