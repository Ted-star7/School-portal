import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServicesService } from '../Services/consume.service';
import { SessionService } from '../Services/session.service';
import { HttpClientModule } from '@angular/common/http';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.css'],
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule, HttpClientModule]
})
export class TeachersComponent implements OnInit {
  teacherForm: FormGroup;
  subjects = ['Mathematics', 'English', 'Science', 'Kiswahili', 'CRE'];
  showImpairmentDetails = false;
  isLoading = false;
  successMessage = '';
  teachers: any[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages: number[] = [];
  selectedCvFile: File | null = null;  // Add this property to store the selected CV file

  constructor(private fb: FormBuilder, private serviceServices: ServicesService, private sessionService: SessionService) {
    this.teacherForm = this.fb.group({
      fullName: ['', Validators.required],
      idNumber: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      nhifNumber: ['', Validators.required],
      nssfNumber: ['', Validators.required],
      tscNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mainSubject: ['', Validators.required],
      secSubject: ['', Validators.required],
      gender: ['', Validators.required],
      impairement: ['No', Validators.required],
      impairementDetails: [''],
      yob: ['', Validators.required],
      cvFile: ['', Validators.required],
    });
  }

  ngOnInit() {}

  onImpairmentChange(event: any) {
    this.showImpairmentDetails = event.target.value === 'Yes';
    if (this.showImpairmentDetails) {
      this.teacherForm.get('impairementDetails')?.setValidators([Validators.required]);
    } else {
      this.teacherForm.get('impairementDetails')?.clearValidators();
      this.teacherForm.get('impairementDetails')?.setValue('');
    }
    this.teacherForm.get('impairementDetails')?.updateValueAndValidity();
  }

  onCvFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedCvFile = file;
      this.teacherForm.patchValue({
        cvFile: file
      });
    }
  }

  onSubmit() {
    if (this.teacherForm.valid) {
      this.isLoading = true;

      const formData = new FormData();
      Object.keys(this.teacherForm.controls).forEach(key => {
        formData.append(key, this.teacherForm.get(key)?.value);
      });

      if (this.selectedCvFile) {
        formData.append('cvFile', this.selectedCvFile);  // Append the CV file to the FormData
      }

      const token = this.sessionService.getToken();
      this.serviceServices.postFormData('/api/admins/teachers/register', formData, token).subscribe(
        response => {
          this.isLoading = false;
          this.successMessage = 'Registration successful!';
          console.log('Success:', response);
        },
        error => {
          this.isLoading = false;
          console.error('Registration error:', error);
          this.successMessage = 'Registration failed. Please try again.';
        }
      );
    }
  }
}
