import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SessionService } from '../Services/session.service';
import { ServicesService } from '../Services/consume.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.css'],
  standalone: true,
  imports: [NgFor, NgIf,ReactiveFormsModule, HttpClientModule]
})
export class TeachersComponent {
  teacherForm: FormGroup;
  subjects = ['Mathematics', 'English', 'Science', 'Kiswahili', 'Cre']; 
  showImpairmentDetails = false;
  isLoading = false;
  successMessage =''

  constructor(private fb: FormBuilder, private serviceServices: ServicesService) {
    this.teacherForm = this.fb.group({
      fullName: ['', Validators.required],
      idNumber: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mainSubject: ['', Validators.required],
      secSubject: ['', Validators.required],
      gender: ['', Validators.required],
      impairement: ['No', Validators.required],
      impairementDetails: [''],
      yob: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

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

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Handle file upload logic
    }
  }

  onSubmit() {
    if (this.teacherForm.valid) {
      console.log(this.teacherForm.value);
      this.serviceServices.postRequest('/api/admins/teachers/registration', FormGroup, null).subscribe(
        response => {
        this.isLoading = false;
        this.successMessage = 'Registration successful!';
      },
      error => {
        this.isLoading = false;
        console.error('Registration error:', error);
        this.successMessage = 'Registration failed. Please try again.';
      }
      )
    }
  }
}
