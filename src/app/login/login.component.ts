import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServicesService } from '../Services/consume.service';
import { Router } from '@angular/router';
import { SessionService } from '../Services/session.service';
import { HttpClientModule } from '@angular/common/http'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf, HttpClientModule], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'], 
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
      const token = response.token;
      const userId = response['admin id'];
      const userName = response.userName; 
      const pfpUrl = response.pfpUrl; 

      if (token && userId) {
        this.session.saveToken(token);
        this.session.saveUserId(String(userId));
        this.session.saveuserName(userName); 
        this.session.savepfpUrl(pfpUrl); 

        this.successMessage = 'Login successful!';
        setTimeout(() => this.router.navigate(['/dashboard']), 1000);
      } else {
        this.successMessage = 'Login failed. Please try again.';
      }
    },
    (error) => {
      this.isLoading = false;
      console.error('Login error:', error);
      
      if (error.status === 401) { // Assuming 401 is the status for unauthorized access
        this.successMessage = 'Wrong password or email. Please try again.';
      } else {
        this.successMessage = 'Login failed. Please try again.';
      }
    }
  );
}

}

