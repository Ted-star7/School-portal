import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent {
  student: any = {
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    email: '',
    enrollmentDate: '',
    className: '',
    grade: '',
    registrationNumber: '',
    profilePicture: null,
    homeAddress: '',
    fathersName: '',
    mothersName: '',
    guardianName: '',
    city: '',
    county: ''
  };

  students: any[] = []; // This will hold the list of registered students
  selectedStudent: any = null;

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.student.profilePicture = file;
    }
  }

  onSubmit() {
    if (this.student.profilePicture) {
      // Handle the form submission and file upload
      console.log('Student Registered:', this.student);
      this.students.push(this.student); // Add the registered student to the list
      this.student = {}; // Clear the form after submission
    }
  }

  selectStudent(student: any) {
    this.selectedStudent = student;
  }

  // This function will be used to load students from the API once the endpoint is available
  loadStudents() {
    // Use HTTPClient to fetch students from your backend API
    // Assign the result to this.students
  }
}
