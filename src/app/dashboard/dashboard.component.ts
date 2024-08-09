import { Component, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular'; // Import the FullCalendar module
import dayGridPlugin from '@fullcalendar/daygrid'; // Import dayGrid plugin
import interactionPlugin from '@fullcalendar/interaction'; // Import interaction plugin

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  calendarOptions: any;

  ngOnInit() {
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      selectable: true,
      dateClick: this.handleDateClick.bind(this),
      events: []
    };
  }

  handleDateClick(arg: any) {
    alert('Date clicked: ' + arg.dateStr);
    // You can add logic here to add an event
  }
}
