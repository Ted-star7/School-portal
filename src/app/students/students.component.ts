import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ServicesService } from '../Services/consume.service';
import { SessionService } from '../Services/session.service';

interface Student {
  id: number;
  fullName: string;
  dateOfBirth: string | null;
  gender: string;
  religion: string;
  admissionNumber: string;
  email: string;
  emergencyContact: string;
  fatherName: string;
  fatherPhone: string;
  motherName: string;
  motherPhone: string;
  address: string;
  studentClass: string;
  pfpUrl: string;
  photo: string;
  progress?: any;
}

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  students: Student[] = [];
  selectedStudent: Student | null = null;
  searchTerm: string = '';

  constructor(
    private servicesService: ServicesService, 
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.fetchStudents();
  }

  fetchStudents(): void {
    const token = this.sessionService.getToken();
    if (token) {
      this.servicesService.getStudents(token).subscribe(
        (response: { data: Student[] }) => {
          this.students = response.data.map(student => ({
            ...student,
            photo: student.pfpUrl || 'assets/logo.jpg' // Use pfpUrl if available
          }));

          // Set the first student as the default selected student
          if (this.students.length > 0) {
            this.selectedStudent = this.students[0];
          }
        },
        error => {
          console.error('Error fetching students', error);
        }
      );
    } else {
      console.error('No token found');
    }
  }

  searchStudents(): Student[] {
    if (!this.searchTerm) {
      return this.students;
    }

    return this.students.filter(student =>
      student.fullName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      student.admissionNumber.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  selectStudent(student: Student): void {
    this.selectedStudent = student;
  }

  getStudentDetails(): { label: string, value: string | undefined }[] {
    return [
      { label: 'Gender', value: this.selectedStudent?.gender },
      { label: 'Date of Birth', value: this.selectedStudent?.dateOfBirth || 'Not provided' },
      { label: 'Religion', value: this.selectedStudent?.religion },
      { label: 'Admission Number', value: this.selectedStudent?.admissionNumber },
      { label: 'Email', value: this.selectedStudent?.email },
      { label: 'Emergency Contact', value: this.selectedStudent?.emergencyContact },
      { label: 'Father Name', value: this.selectedStudent?.fatherName },
      { label: 'Father Phone', value: this.selectedStudent?.fatherPhone },
      { label: 'Mother Name', value: this.selectedStudent?.motherName },
      { label: 'Mother Phone', value: this.selectedStudent?.motherPhone },
      { label: 'Address', value: this.selectedStudent?.address }
    ];
  }
}
