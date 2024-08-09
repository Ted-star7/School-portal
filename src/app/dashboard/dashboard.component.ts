import { Component, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular'; 
import dayGridPlugin from '@fullcalendar/daygrid'; 
import interactionPlugin from '@fullcalendar/interaction'; 
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FullCalendarModule, CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  calendarOptions: any;
  isEventFormOpen: boolean = false;
  eventTitle: string = '';
  selectedDate: string = '';

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
    this.selectedDate = arg.dateStr; // Save the selected date
    this.isEventFormOpen = true; // Open the event form
  }

  openEventForm() {
    this.isEventFormOpen = true; // Show the event form
  }

  closeEventForm() {
    this.isEventFormOpen = false; // Hide the event form
    this.eventTitle = ''; // Reset the event title
  }

  saveEvent() {
    if (this.eventTitle) {
      const newEvent = {
        title: this.eventTitle,
        date: this.selectedDate,
      };
      this.calendarOptions.events.push(newEvent); // Add the event to the calendar
      this.closeEventForm(); // Close the form
    }
  }
}
