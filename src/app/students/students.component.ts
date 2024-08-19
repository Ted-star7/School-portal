import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ServicesService } from '../Services/consume.service';

interface Student {
  photo: string;
  name: string;
  id: string;
  class: string;
  gender: string;
  dateOfBirth: string;
  religion: string;
  admissionNumber: string;
  address: string;
  emergencyContact: string;
  fatherName: string;
  fatherPhone: string;
  motherName: string;
  motherPhone: string;
  progress: number;
}

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  students: Student[] = [];
  selectedStudent: Student | null = null;
  searchTerm: string = '';

  constructor(private servicesService: ServicesService) {}

  ngOnInit(): void {
    this.fetchStudents();
  }

  fetchStudents(): void {
    this.servicesService.getRequest('/api/students').subscribe(
      (data: Student[]) => {
        this.students = data;
      },
      (error) => {
        console.error('Error fetching students:', error);
      }
    );
  }

  selectStudent(student: Student): void {
    this.selectedStudent = student;
  }

  searchStudents(): Student[] {
    if (!this.searchTerm) {
      return this.students;
    }

    return this.students.filter(student =>
      student.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      student.admissionNumber.includes(this.searchTerm)
    );
  }
}
