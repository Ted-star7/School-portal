import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ServicesService } from '../Services/consume.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Import CommonModule for ngIf

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [HttpClientModule, FormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  email = '';
  otp = '';
  newPassword = '';
  confirmPassword = '';
  otpSent = false;
  timer = 300; // 5 minutes
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private servicesService: ServicesService, private router: Router) {}

  ngOnInit() {
    this.startTimer();
  }

  startTimer() {
    const interval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        clearInterval(interval);
      }
    }, 1000);
  }

  resendOTP() {
    if (this.timer === 0) {
      this.sendOTP();
      this.timer = 300;
      this.startTimer();
    }
  }

  sendOTP() {
    this.isLoading = true;
    this.servicesService.postRequest('/api/open/admins/reset-password/request', { email: this.email }, null).subscribe(
      () => {
        this.isLoading = false;
        this.otpSent = true;
        this.successMessage = 'OTP has been sent to your email.';
      },
      error => {
        this.isLoading = false;
        this.errorMessage = 'Failed to send OTP. Please try again.';
        console.error('OTP request error:', error);
      }
    );
  }

  confirmOTP() {
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    const formData = {
      email: this.email,
      otp: this.otp,
      newPassword: this.newPassword,
    };

    this.isLoading = true;
    this.servicesService.postRequest('/api/open/admins/reset-password/confirm', formData, null).subscribe(
      () => {
        this.isLoading = false;
        this.successMessage = 'Password reset successful! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 2000); // Redirect to login after 2 seconds
      },
      error => {
        this.isLoading = false;
        this.errorMessage = 'Failed to reset password. Please try again.';
        console.error('Password reset error:', error);
      }
    );
  }

  get formattedTimer() {
    const minutes = Math.floor(this.timer / 60);
    const seconds = this.timer % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
}
