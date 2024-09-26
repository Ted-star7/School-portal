import { Component, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ServicesService } from '../Services/consume.service';
import { SessionService } from '../Services/session.service';
import { Chart, registerables } from 'chart.js'; 
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FullCalendarModule, CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  public doughnutChartLabels: string[] = ['Boys', 'Girls'];
  public doughnutChartData: number[] = [0, 0]; 
  public doughnutChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
  };

  calendarOptions: any;
  events: any[] = [];
  isEventFormOpen: boolean = false;
  eventTitle: string = '';
  eventDescription: string = '';
  selectedDate: string = '';
  totalStudents: number = 0;
  totalTeachers: number = 0;
  totalParents: number = 0;
  adminPfp: string = ''; 

  constructor(
    private service: ServicesService,
    private router: Router,
    private sessionService: SessionService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      selectable: true,
      dateClick: this.handleDateClick.bind(this),
      events: [] 
    };

    this.loadDashboardData(); 
  }

  
  loadDashboardData() {
    this.fetchTotalStudents();
    this.fetchTotalTeachers();
    this.fetchTotalParents();
    this.fetchEvents();
    this.fetchStudentRatio(); 
  }

  
  fetchStudentRatio() {
    const token = this.sessionService.getToken();
    if (token) {
      this.service.getRequest('/api/admins/students/ratio', token).subscribe(
        (response: any) => {
         this.doughnutChartData = [response.malePercentage, response.femalePercentage];
 
        },
        (error) => {
          console.error('Failed to fetch student ratio:', error);
        }
      );
    }
  }

  
  fetchTotalStudents() {
    const token = this.sessionService.getToken();
    if (token) {
      this.service.getRequest('/api/admins/students/total', token).subscribe(
        (response: any) => {
          this.totalStudents = response.totalStudents; 
        },
        (error) => {
          console.error('Failed to fetch total students:', error);
        }
      );
    }
  }

  
  fetchTotalTeachers() {
    const token = this.sessionService.getToken();
    if (token) {
      this.service.getRequest('/api/admins/teachers/total', token).subscribe(
        (response: any) => {
          this.totalTeachers = response.totalTeachers; // Make sure your response has totalTeachers
        },
        (error) => {
          console.error('Failed to fetch total teachers:', error);
        }
      );
    }
  }

  
  fetchTotalParents() {
    const token = this.sessionService.getToken();
    if (token) {
      this.service.getRequest('/api/parents/count', token).subscribe(
        (response: any) => {
          this.totalParents = response.totalParents; // Ensure that the response has the correct total property
        },
        (error) => {
          console.error('Failed to fetch total parents:', error);
        }
      );
    }
  }

 
  fetchEvents() {
    const token = this.sessionService.getToken();
    if (token) {
      this.service.getRequest('/api/open/events', token).subscribe(
        (response: any) => {
          this.events = response; // Make sure your API returns an array of events
          this.calendarOptions.events = this.events.map(event => ({
            title: event.eventTitle,
            start: event.selectedDate,
            description: event.eventDescription,
          }));
        },
        (error) => {
          console.error('Failed to fetch events:', error);
        }
      );
    }
  }

  // Handle date click from the calendar
  handleDateClick(arg: any) {
    this.selectedDate = arg.dateStr;
    this.openEventForm();
  }

  // Open the event form
  openEventForm() {
    this.isEventFormOpen = true;
  }

 
  closeEventForm() {
    this.isEventFormOpen = false;
    this.eventTitle = '';
    this.eventDescription = '';
  }

  // Save the event to the backend
  saveEvent() {
    const token = this.sessionService.getToken();
    const eventData = {
      eventTitle: this.eventTitle,
      eventDescription: this.eventDescription,
      selectedDate: this.selectedDate
    };

    if (token) {
      this.service.postRequest('/api/open/events/record', eventData, token).subscribe(
        (response: any) => {
          this.fetchEvents(); // Refresh events after saving
          this.closeEventForm();
        },
        (error) => {
          console.error('Failed to save event:', error);
        }
      );
    }
  }

  // Navigation
  goToStudentsPage() {
    this.router.navigate(['/students']);
  }

  
  goToTeachersListPage() {
    this.router.navigate(['/teacherslisting']);
  }

  
  goToParentsPage() {
    this.router.navigate(['/parents']);
  }

 
  onProfilePicClick() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  // Profile picture selection handler
  onProfilePicSelected(event: any) {
  const file = event.target.files[0];

  if (file) {
    const adminId = this.sessionService.getUserId(); // Get adminId from session

    if (adminId) {
      this.uploadProfilePicture(adminId, file); // Call the method to upload the image file
    } else {
      console.error('User ID not found in session.');
    }
  }
}

uploadProfilePicture(adminId: string, file: File) {
  const token = this.sessionService.getToken();

  if (token) {
    const formData = new FormData();
    formData.append('adminPfp', file); // Append the file to the form data

    // You may need to append other fields if required by the backend
    formData.append('adminId', adminId);

    this.service.postRequest(`/api/open/admins/pfp/${adminId}`, formData, token).subscribe(
      (response: any) => {
        console.log('Profile picture uploaded successfully:', response);
        // Optionally, you can update the displayed profile picture by setting it to the new URL
        this.adminPfp = URL.createObjectURL(file); // Preview the uploaded image immediately
      },
      (error) => {
        console.error('Failed to upload profile picture:', error);
        // Optionally show error feedback
      }
    );
  } else {
    console.error('No token found in session.');
  }
}


}
