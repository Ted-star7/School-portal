import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ServicesService } from '../Services/consume.service';
import { SessionService } from '../Services/session.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [HttpClientModule, FormsModule, CommonModule, FontAwesomeModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  fullName = '';
  email = '';
  password = '';
  showPassword = false;
  isLoading = false;
  successMessage = '';

  constructor(
    private servicesService: ServicesService,
    private router: Router,
    library: FaIconLibrary
  ) {
    library.addIcons(faEye, faEyeSlash);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onRegister() {
    this.isLoading = true;
    const formData = {
      fullName: this.fullName,
      email: this.email,
      password: this.password
    };

    this.servicesService.postRequest('/api/open/admins/register', formData, null).subscribe(
      response => {
        this.isLoading = false;
        this.successMessage = 'Registration successful! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 2000); 
      },
      error => {
        this.isLoading = false;
        console.error('Registration error:', error);
        this.successMessage = 'Registration failed. Please try again.';
      }
    );
  }
}
