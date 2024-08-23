import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServicesService } from '../Services/consume.service';
import { SessionService } from '../Services/session.service';

interface Student {
  progress: any;
  id: number;
  fullName: string;
  dateOfBirth: string;
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
  pfpId: number;
  photo?: string;
}

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent {
  students: Student[] = [];
  selectedStudent: Student | null = null;
  searchTerm: string = '';

  constructor(private servicesService: ServicesService, private sessionService: SessionService) {
    this.fetchStudents();
  }

  fetchStudents(): void {
    const token = this.sessionService.getToken();
    if (token) {
      this.servicesService.getStudents(token).subscribe(
        data => {
          this.students = data;
          this.fetchStudentPhotos();  // Fetch photos after students are loaded
        },
        error => {
          console.error('Error fetching students', error);
        }
      );
    } else {
      console.error('No token found');
    }
  }

  fetchStudentPhotos(): void {
  const token = this.sessionService.getToken();
  if (token) {
    this.students.forEach(student => {
      if (student.pfpId !== null && student.pfpId !== undefined) {
        this.servicesService.getProfilePicture(student.pfpId, token).subscribe(
          photoData => {
            if (photoData && photoData.imgUrl) { // Assuming imgUrl is the usable image URL
              student.photo = photoData.imgUrl; // Directly use the image URL
            } else {
              student.photo = 'assets/logo.jpg'; // Path to default photo in assets
            }
          },
          error => {
            console.error(`Error fetching photo for student ${student.fullName}:`, error);
            student.photo = 'assets/logo.jpg'; // Path to default photo in assets on error
          }
        );
      } else {
        student.photo = 'assets/logo.jpg'; // Path to default photo in assets if no pfpId
      }
    });
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
      { label: 'Date of Birth', value: this.selectedStudent?.dateOfBirth },
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
