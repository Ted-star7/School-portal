import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ServicesService } from '../Services/consume.service';
import { SessionService } from '../Services/session.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-classes',
  standalone: true,
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class ClassesComponent implements OnInit {
  classesForm: FormGroup;
  teachers: string[] = []; // Will be populated from API
  classList: any[] = [];
  editingClass: any = null; // Holds the class being edited

  // Dropdown options
  classNames: string[] = ['Zoe', 'Agape', 'Shalome', 'Alpha', 'Eden', 'Ruach', 'Amuna', 'Haddar', 'Shammar'];
  classNumbers: string[] = ['Playgroup', 'PP1', 'PP2', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6'];

  constructor(
    private fb: FormBuilder,
    private service: ServicesService,
    private sessionService: SessionService // Inject SessionService
  ) {
    this.classesForm = this.fb.group({
      className: ['', Validators.required],
      classNumber: ['', Validators.required],
      teacher: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getTeachers();
    this.getClasses();
  }

  // Fetch teachers from API
  getTeachers(): void {
    const token = this.sessionService.getToken();
    if (token){
     this.service.getRequest('/api/admins/teachers', token).subscribe({
      next: (teachers) => {
        this.teachers = teachers.map((t: { fullName: string }) => t.fullName);
      },
      error: (err) => console.error('Failed to fetch teachers', err),
    });
  };
   
  }

  // Fetch classes from API
  getClasses(): void {
    const token = this.sessionService.getToken(); // Retrieve token from session
    this.service.getRequest('/api/class', token).subscribe({
      next: (classes) => {
        this.classList = classes;
      },
      error: (err) => console.error('Failed to fetch classes', err),
    });
  }

  // Add or edit class
  saveClass(): void {
    if (this.classesForm.valid) {
      const classData = this.classesForm.value;
      const token = this.sessionService.getToken(); // Retrieve token from session

      if (this.editingClass) {
        // Update class
        this.service.putRequest(`/api/class/${this.editingClass.id}`, classData, token).subscribe({
          next: () => {
            this.getClasses();
            this.cancelEdit();
          },
          error: (err) => console.error('Failed to update class', err),
        });
      } else {
        // Add new class
        this.service.postRequest('/api/class', classData, token).subscribe({
          next: () => {
            this.getClasses();
          },
          error: (err) => console.error('Failed to add class', err),
        });
      }

      this.classesForm.reset();
    }
  }

  // Edit class
  editClass(cls: any): void {
    this.editingClass = cls;
    this.classesForm.patchValue({
      className: cls.className,
      classNumber: cls.classNumber,
      teacher: cls.teacher
    });
  }

  // Cancel editing
  cancelEdit(): void {
    this.editingClass = null;
    this.classesForm.reset();
  }

  // Delete class
  deleteClass(id: number): void {
    const token = this.sessionService.getToken(); // Retrieve token from session
    this.service.deleteRequest(`/api/class/${id}`, token).subscribe({
      next: () => {
        this.getClasses();
      },
      error: (err) => console.error('Failed to delete class', err),
    });
  }
}
