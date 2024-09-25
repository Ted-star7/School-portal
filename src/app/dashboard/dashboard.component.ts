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
  // Chart data and options
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

  // Load all data on initialization
  loadDashboardData() {
    this.fetchTotalStudents();
    this.fetchTotalTeachers();
    this.fetchTotalParents();
    this.fetchEvents();
    this.fetchStudentRatio(); 
  }

  // Fetch student ratio
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

  // Fetch total students from the backend
  fetchTotalStudents() {
    const token = this.sessionService.getToken();
    if (token) {
      this.service.getRequest('/api/admins/students/total', token).subscribe(
        (response: any) => {
          this.totalStudents = response.totalStudents; // Make sure your response has totalStudents
        },
        (error) => {
          console.error('Failed to fetch total students:', error);
        }
      );
    }
  }

  // Fetch total teachers from the backend
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

  // Fetch total parents from the backend
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

  // Fetch events from the backend
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

  // Close the event form
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

  // Navigate to students page
  goToStudentsPage() {
    this.router.navigate(['/students']);
  }

  // Navigate to teachers page
  goToTeachersListPage() {
    this.router.navigate(['/teachers-list']);
  }

  // Navigate to parents page
  goToParentsPage() {
    this.router.navigate(['/parents']);
  }

  // Profile picture click handler
  onProfilePicClick() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  // Profile picture selection handler
  onProfilePicSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Implement file upload logic
    }
  }
}
