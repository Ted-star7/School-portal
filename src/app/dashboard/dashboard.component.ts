import { Component, OnInit } from '@angular/core'; 
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ServicesService } from '../Services/consume.service';
import { SessionService } from '../Services/session.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FullCalendarModule, CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  calendarOptions: any;
  events: any[] = [];
  isEventFormOpen: boolean = false;
  eventTitle: string = '';
  eventDescription: string = '';
  selectedDate: string = '';
  totalStudents: number = 0;
  totalTeachers: number = 0;
  totalParents: number = 0;
  adminPfp: string = ''; // Admin profile picture URL

  constructor(
    private service: ServicesService, 
    private router: Router, 
    private sessionService: SessionService
  ) {}

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
    this.fetchTotalParents();
    this.fetchEvents();
  }

  // Fetch total students from the backend
  fetchTotalStudents() {
    const token = this.sessionService.getToken();
    if (token) {
      this.service.getRequest('/api/admins/students/total', token).subscribe(
        (response: any) => {
          this.totalStudents = response.totalStudents;
        },
        (error) => {
          console.error('Failed to fetch students:', error);
        }
      );
    } else {
      console.error('No token found');
    }
  }

  // Fetch events from the backend
  fetchEvents() {
    this.service.getRequest('/api/open/events', null).subscribe(
      (response: any) => {
        this.events = response; // Assuming response is an array of events
        this.calendarOptions.events = this.events.map(event => ({
          title: event.eventTitle,
          start: event.selectedDate,
        }));
      },
      (error) => {
        console.error('Failed to fetch events:', error);
      }
    );
  }

  // Fetch total teachers
  fetchTotalTeachers() {
    const token = this.sessionService.getToken();
    if (token) {
      this.service.getRequest('/api/admins/teachers/total', token).subscribe(
        (response: any) => {
          this.totalTeachers = response.totalTeachers;
        },
        (error) => {
          console.error('Failed to fetch teachers:', error);
        }
      );
    } else {
      console.error('No token found');
    }
  }

  // Fetch total parents
  fetchTotalParents() {
    const token = this.sessionService.getToken();
    if (token) {
      this.service.getRequest('/api/parents/count', token).subscribe(
        (response: any) => {
          this.totalParents = response.totalParents;
        },
        (error) => {
          console.error('Failed to fetch parents:', error);
        }
      );
    } else {
      console.error('No token found');
    }
  }

  // Handle date click from the calendar
  handleDateClick(arg: any) {
    this.selectedDate = arg.dateStr;
    this.isEventFormOpen = true; 
  }

  // Open the event form
  openEventForm() {
    this.isEventFormOpen = true; 
  }

  // Close the event form
  closeEventForm() {
    this.isEventFormOpen = false;
    this.eventTitle = '';
    this.eventDescription = '';
    this.selectedDate = '';
  }

  // Save the event to the backend
  saveEvent() {
    if (this.eventTitle) {
      const newEvent = {
        eventTitle: this.eventTitle,
        eventDescription: this.eventDescription,
        selectedDate: this.selectedDate,
      };

      // Post the event to the server
      this.service.postRequest('/api/open/events/record', newEvent, null).subscribe(
        (response) => {
          console.log('Event saved successfully:', response);
          
          // Re-fetch events from the server
          this.fetchEvents();
          
          this.closeEventForm(); // Close the form
        },
        (error) => {
          console.error('Failed to save event:', error);
        }
      );
    }
  }

  // Upload admin profile picture
onProfilePicClick() {
  const fileInput = document.getElementById('fileInput') as HTMLInputElement;
  fileInput.click(); // Trigger the file input click event
}

onProfilePicSelected(event: any) {
  const file = event.target.files[0]; // Grab the selected file
  if (file) {
    const formData = new FormData(); // Create a new FormData object

    // Append file and admin ID to FormData
    formData.append('adminPfp', file); // Append the file
    formData.append('adminId', 'yourAdminId'); // Replace 'yourAdminId' with actual ID

    const token = this.sessionService.getToken();
    if (token) {
      this.service.postFormData(`/api/open/admins/pfp/${'yourAdminId'}`, formData, token).subscribe(
        (response: any) => {
          console.log('Profile picture updated successfully:', response);
          this.adminPfp = response.adminPfp; // Update UI with new profile picture URL
        },
        (error: any) => {
          console.error('Failed to upload profile picture:', error);
        }
      );
    } else {
      console.error('No token found');
    }
  }
}





  // Navigation functions
  goToStudentsPage() {
    this.router.navigate(['/students']);
  }

  goToParentsPage() {
    this.router.navigate(['/parents']);
  }

  goToTeachersListPage() {
    this.router.navigate(['/teacherslisting']);
  }
}
