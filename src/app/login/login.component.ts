import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServicesService } from '../Services/consume.service';
import { Router } from '@angular/router';
import { SessionService } from '../Services/session.service';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf, HttpClientModule], // Add HttpClientModule here
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'], // Fixed typo from styleUrl to styleUrls
})
export class LoginComponent {
  email = '';
  password = '';
  isLoading = false;
  successMessage = '';

  constructor(
    private serviceServices: ServicesService,
    private router: Router,
    private session: SessionService,
  ) {}

  onLogin(): void {
    this.isLoading = true;
    const formData = {
      email: this.email,
      password: this.password,
    };

    this.serviceServices.postRequest('/api/open/admins/login', formData, null).subscribe(
      (response) => {
        this.isLoading = false;

        // Assuming the response is already an object, no need to parse
        const token = response.token;
        const userId = response['admin id']; // Use response['admin id'] to correctly access the userId

        if (token && userId) {
          this.session.saveToken(token);
          this.session.saveUserId(String(userId)); // Ensure userId is saved as a string
          this.successMessage = 'Login successful!';
          setTimeout(() => this.router.navigate(['/dashboard']), 1000); // Redirect after 1 second
        } else {
          this.successMessage = 'Login failed. Please try again.';
        }
      },
      (error) => {
        this.isLoading = false;
        console.error('Login error:', error);
        this.successMessage = 'Login failed. Please try again.';
      }
    );
  }
}
