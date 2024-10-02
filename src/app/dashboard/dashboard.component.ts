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

  public attendanceLabels: string[] = ['Zoe', 'Agape', 'Shalome', 'Alpha', 'Eden', 'Ruach', 'Amuna', 'Haddar', 'Shammar'];
  public attendanceData: number[] = [];
  public attendanceChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Attendance Count',
        }
      }
    }
  };

  calendarOptions: any;
  events: any[] = [];
  pastEvents: any[] = [];
  isEventFormOpen: boolean = false;
  eventTitle: string = '';
  eventDescription: string = '';
  selectedDate: string = '';
  totalStudents: number = 0;
  totalTeachers: number = 0;
  totalParents: number = 0;
  adminPfp: string = ''; 
  showSuccessMessage: boolean = false; 
  showEventSuccessMessage: boolean = false; 
  eventSuccessMessage: string = ''; 
  userName: string = ''; 

  constructor(
    private service: ServicesService,
    private router: Router,
    private sessionService: SessionService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.initializeCalendar();
    this.loadDashboardData();
    this.userName = this.sessionService.getuserName() ?? 'Guest';
    this.fetchAdminProfilePicture(); 
  }

  initializeCalendar() {
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      selectable: true,
      dateClick: this.handleDateClick.bind(this),
      events: []
    };
  }

  getGreeting(): string {
  const currentHour = new Date().getHours();
  if (currentHour < 12) {
    return 'Good Morning';
  } else if (currentHour < 18) {
    return 'Good Afternoon';
  } else {
    return 'Good Evening';
  }
}


  loadDashboardData() {
    this.fetchTotalStudents();
    this.fetchTotalTeachers();
    this.fetchTotalParents();
    this.fetchEvents();
    this.fetchStudentRatio();
    this.fetchAttendanceOverview();
  }

  fetchAttendanceOverview() {
    const token = this.sessionService.getToken();
    if (token) {
      this.service.getRequest('/api/admins/students/attendance', token).subscribe(
        (response: any) => {
          this.attendanceData = response.attendanceData;
        },
        (error) => {
          console.error('Failed to fetch attendance overview:', error);
        }
      );
    }
  }

  fetchStudentRatio() {
    const token = this.sessionService.getToken();
    if (token) {
      this.service.getRequest('/api/admins/students/ratio', token).subscribe(
        (response: any) => {
          this.doughnutChartData = [response.maleCount, response.femaleCount];
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
          this.totalTeachers = response.totalTeachers;
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
          this.totalParents = response.totalParents;
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
          const today = new Date().toISOString().split('T')[0];
          this.events = response.filter((event: any) => event.selectedDate >= today);
          this.pastEvents = response.filter((event: any) => event.selectedDate < today);
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

  handleDateClick(arg: any) {
    this.selectedDate = arg.dateStr;
    this.openEventForm();
  }

  openEventForm() {
    this.isEventFormOpen = true;
  }

  closeEventForm() {
    this.isEventFormOpen = false;
    this.eventTitle = '';
    this.eventDescription = '';
  }

  saveEvent() {
    const token = this.sessionService.getToken();
    const eventData = {
      eventTitle: this.eventTitle,
      eventDescription: this.eventDescription,
      selectedDate: this.selectedDate
    };

    if (token) {
      this.service.postRequest('/api/open/events/record', eventData, token).subscribe(
        () => {
          this.fetchEvents();
          this.closeEventForm();
          this.displaySuccessMessage('Event posted successfully!');
        },
        (error) => {
          console.error('Failed to save event:', error);
        }
      );
    }
  }

  deleteEvent(eventId: string) {
    const token = this.sessionService.getToken();
    if (token) {
      this.service.deleteRequest(`/api/event/${eventId}`, token).subscribe(
        () => {
          this.fetchEvents();
          this.displaySuccessMessage('Event deleted successfully!');
        },
        (error) => {
          console.error('Failed to delete event:', error);
        }
      );
    }
  }

  displaySuccessMessage(message: string) {
    this.showEventSuccessMessage = true;
    this.eventSuccessMessage = message;
    setTimeout(() => {
      this.showEventSuccessMessage = false;
    }, 3000);
  }

  goToStudentsPage() {
    this.router.navigate(['/students']);
  }

  goToTeachersListPage() {
    this.router.navigate(['/teachers']);
  }

  goToParentsPage() {
    this.router.navigate(['/parents']);
  }

  fetchAdminProfilePicture() {
    const adminPfp = this.sessionService.getpfpUrl();
    this.adminPfp = adminPfp || '';
  }

  onProfilePicClick() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  onProfilePicSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const adminId = this.sessionService.getUserId();
      if (adminId) {
        this.uploadProfilePicture(adminId, file);
      } else {
        console.error('User ID not found in session.');
      }
    }
  }

  uploadProfilePicture(adminId: string, file: File) {
    const token = this.sessionService.getToken();
    if (token) {
      const formData = new FormData();
      formData.append('adminPfp', file);
      formData.append('adminId', adminId);

      this.service.postFormData(`/api/open/admins/pfp/${adminId}`, formData, token).subscribe(
        () => {
          this.adminPfp = URL.createObjectURL(file);
          this.showSuccessMessage = true;
          setTimeout(() => {
            this.showSuccessMessage = false;
          }, 3000);
        },
        (error) => {
          console.error('Failed to upload profile picture:', error);
        }
      );
    } else {
      console.error('No token found in session.');
    }
  }
}
