import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SessionService } from '../Services/session.service';
import { ServicesService } from '../Services/consume.service';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css'],
  standalone: true, // Enables standalone component
  imports: [FormsModule, NgFor, NgIf]  // Ensure FormsModule, NgFor, and NgIf are imported
})
export class TimetableComponent implements OnInit {
  term: string = '';
  year: number = new Date().getFullYear();
  startDate: string = '';
  endDate: string = '';
  timetable: any = {};
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private sessionService: SessionService, private servicesService: ServicesService) {}

  ngOnInit(): void {
    this.initializeTimetable();
  }

  // Initialize timetable with default structure
  private initializeTimetable(): void {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const times = this.getTimes();

    days.forEach(day => {
      this.timetable[day] = {};
      times.forEach(time => {
        if (this.isConstant(time)) {
          this.timetable[day][time] = this.getConstantLabel(time); // Fixed time slots for constants
        } else {
          this.timetable[day][time] = ''; // Editable slots
        }
      });
    });
  }

  // Time slots for each day
  getTimes(): string[] {
    return [
      '7:00 AM - 8:00 AM',
      '8:00 AM - 9:00 AM',
      '9:00 AM - 10:00 AM',
      '10:00 AM - 11:00 AM', // Tea Break
      '11:00 AM - 12:00 PM',
      '12:00 PM - 1:00 PM', // Lunch Break
      '1:00 PM - 2:00 PM',
      '2:00 PM - 3:00 PM',
      '3:00 PM - 4:00 PM',
      '4:00 PM - 5:00 PM'
    ];
  }

  // Check if the time slot is a constant break (e.g. Lunch or Tea break)
  isConstant(time: string): boolean {
    return ['12:00 PM - 1:00 PM', '10:00 AM - 11:00 AM'].includes(time); // Specify constants
  }

  // Get label for constant time slots
  getConstantLabel(time: string): string {
    if (time === '12:00 PM - 1:00 PM') return 'Lunch Break';
    if (time === '10:00 AM - 11:00 AM') return 'Tea Break';
    return '';
  }

  // Submit timetable data to the backend service
  public onSubmit(form: NgForm): void {
    if (form.valid) {
      const token = this.sessionService.getToken();
      if (token) {
        const timetableData = {
          term: this.term,
          year: this.year,
          startDate: this.startDate,
          endDate: this.endDate,
          timetable: this.timetable
        };

        // Post the timetable data to the server
        this.servicesService.postRequest('/api/timetable', timetableData, token)
          .subscribe(
            response => {
              this.successMessage = 'Timetable saved successfully!';
            },
            error => {
              this.errorMessage = 'Error saving timetable!';
            }
          );
      } else {
        this.errorMessage = 'User is not logged in!';
      }
    } else {
      this.errorMessage = 'Please fill out the form correctly!';
    }
  }

  // Clear success and error messages
  public clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
