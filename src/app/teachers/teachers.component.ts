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
  cvFileError: string | null = null;
  passportPhotoError: string | null = null;
  selectedCvFile: File | null = null;
  selectedPassportPhoto: File | null = null;

  constructor(private fb: FormBuilder, private serviceServices: ServicesService, private sessionService: SessionService) {
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
      dateOfJoin: ['', Validators.required],
      nssfNumber: [''],
      nhifNumber: [''],
      tscNumber: [''],
      cvFile: [null, Validators.required],
      passportPhoto: [null]  
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
      if (file.type === 'application/pdf') {
        this.selectedCvFile = file;
        this.cvFileError = null;
        this.teacherForm.patchValue({ cvFile: file });
      } else {
        this.cvFileError = 'Please upload a valid PDF file for CV.';
        this.teacherForm.patchValue({ cvFile: null });
      }
    }
  }

  onPassportPhotoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
        this.selectedPassportPhoto = file;
        this.passportPhotoError = null;
        this.teacherForm.patchValue({ passportPhoto: file });
      } else {
        this.passportPhotoError = 'Please upload a valid JPG or PNG file for passport photo.';
        this.teacherForm.patchValue({ passportPhoto: null });
      }
    }
  }

  onSubmit() {
    if (this.teacherForm.valid) {
      this.isLoading = true;

      const formData = new FormData();

      const formdataObject = {
        fullName: this.teacherForm.get('fullName')?.value,
        idNumber: this.teacherForm.get('idNumber')?.value,
        phoneNumber: this.teacherForm.get('phoneNumber')?.value,
        email: this.teacherForm.get('email')?.value,
        mainSubject: this.teacherForm.get('mainSubject')?.value,
        secSubject: this.teacherForm.get('secSubject')?.value,
        gender: this.teacherForm.get('gender')?.value,
        impairement: this.teacherForm.get('impairement')?.value,
        impairementDetails: this.teacherForm.get('impairementDetails')?.value,
        yob: this.teacherForm.get('yob')?.value,
        dateOfJoin: this.teacherForm.get('dateOfJoin')?.value,
        nssfNumber: this.teacherForm.get('nssfNumber')?.value,
        nhifNumber: this.teacherForm.get('nhifNumber')?.value,
        tscNumber: this.teacherForm.get('tscNumber')?.value
      };

      // Convert the formdata object to a JSON string
      formData.append('formdata', JSON.stringify(formdataObject));

      // Append files separately
      if (this.selectedCvFile) {
        formData.append('cvFile', this.selectedCvFile);
      }

      if (this.selectedPassportPhoto) {
        formData.append('passportPhoto', this.selectedPassportPhoto);
      }

      const token = this.sessionService.getToken();
      this.serviceServices.postFormData('/api/admins/teachers/register?formdata=true', formData, token).subscribe(
        response => {
          this.isLoading = false;
          this.successMessage = 'Registration successful!';
          this.resetForm();
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

  resetForm() {
    this.teacherForm.reset({
      impairement: 'No'
    });
    this.showImpairmentDetails = false;
    this.cvFileError = null;
    this.passportPhotoError = null;
    this.selectedCvFile = null;
    this.selectedPassportPhoto = null;
  }
}
