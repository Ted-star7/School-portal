import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SessionService } from '../Services/session.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule,], 
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  constructor(private sessionService:SessionService){}
  logout(){
  this.sessionService.clearSession()
  }
}
