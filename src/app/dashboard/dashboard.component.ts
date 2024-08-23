import { Component, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular'; 
import dayGridPlugin from '@fullcalendar/daygrid'; 
import interactionPlugin from '@fullcalendar/interaction'; 
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';
import { ServicesService } from '../Services/consume.service';
import { SessionService } from '../Services/session.service';
import { error } from 'node:console';
import { TeachersListingComponent } from '../teachers-listing/teachers-listing.component';

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
  eventDescription: string ='';
  selectedDate: string = '';
  totalStudents: number = 0;
  totalTeachers: number = 0;
  totalParents: number =0;

  constructor(private service: ServicesService, private router: Router, private sessionService: SessionService) {}

  ngOnInit() {
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      selectable: true,
      dateClick: this.handleDateClick.bind(this),
      events: []
    };

    this.fetchTotalStudents();
    this.fetchTotalTeachers();
  }

fetchTotalStudents() {
  const token = this.sessionService.getToken();
  if (token) {
    this.service.getRequest('/api/admins/students/total', token).subscribe(
      (response: any) => {
        this.totalStudents = response.totalStudents; // Extract the totalStudents value
      },
      (error) => {
        console.error('Failed to fetch students:', error);
      }
    );
  } else {
    console.error('No token found');
  }
}

fetchTotalTeachers() {
  const token = this.sessionService.getToken();
  if (token) {
    this.service.getRequest('/api/admins/teachers/total', token).subscribe(
      (response: any) => {
        this.totalTeachers = response.totalTeachers; // Extract the totalTeachers value
      },
      (error) => {
        console.error('Failed to fetch teachers:', error);
      }
    );
  } else {
    console.error('No token found');
  }
}
fetchTotalParents(){
  const token =this.sessionService.getToken();
  if(token){
    this.service.getRequest('/api/admins/parents/total', token).subscribe(
      (response: any) => {
        this.totalParents = response.totalParents;
      },
      (error) => {
        console.error('Failed to fetch Teachers', error);
      }
    );
  } else{
    console.error('No token found');
  }
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
        eventTitle: this.eventTitle,
        selectedDate: this.selectedDate,
        eventDescription: this.eventDescription,
      };

      // Post the event to the server
      this.service.postRequest('/api/open/events/record', newEvent, null).subscribe(
        (response) => {
          console.log('Event saved successfully:', response);
          this.calendarOptions.events.push(newEvent); // Add the event to the calendar
          this.closeEventForm(); // Close the form
        },
        (error) => {
          console.error('Failed to save event:', error);
        }
      );
    }
  }

  // Handle click events for navigation
goToStudentsPage() {
  console.log('Navigating to students page');
  this.router.navigate(['/students']);
}

goToTeachersPage() {
  console.log('Navigating to teachers page');
  this.router.navigate(['/teachers']);
}
goToTeachersListPage(){
  console.log('Navigating to teachers list page');
  this.router.navigate(['/teacherslisting'])
}
}
