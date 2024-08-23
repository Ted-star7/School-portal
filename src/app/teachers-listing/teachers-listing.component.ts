import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ServicesService } from '../Services/consume.service';
import { SessionService } from '../Services/session.service';

@Component({
  selector: 'app-teachers-listing',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './teachers-listing.component.html',
  styleUrls: ['./teachers-listing.component.css'],
})
export class TeachersListingComponent implements OnInit {
  teachers: any[] = [];
  searchID: string = '';
  searchName: string = '';
  searchPhone: string = '';
  profilePictures: { [key: number]: string } = {}; // Store profile pictures

  constructor(private service: ServicesService, private sessionService: SessionService) {}

  ngOnInit() {
    this.fetchTeachers();
  }

  fetchTeachers() {
    const token = this.sessionService.getToken();
    this.service.getRequest('/api/admins/teachers', token).subscribe(
      (data) => {
        this.teachers = data;
        this.teachers.forEach((teacher) => {
          this.fetchProfilePicture(teacher.pfpId); // Fetch profile picture for each teacher
        });
      },
      (error) => {
        console.error('Error fetching teachers', error);
      }
    );
  }

  fetchProfilePicture(teacherId: number) {
    this.service.getProfilePicture(teacherId).subscribe(
      (data) => {
        this.profilePictures[teacherId] = URL.createObjectURL(data); // Create a URL for the profile picture
      },
      (error) => {
        console.error('Error fetching profile picture', error);
      }
    );
  }

  filteredTeachers() {
    return this.teachers.filter(teacher =>
      (this.searchID === '' || teacher.idNumber.includes(this.searchID)) &&
      (this.searchName === '' || teacher.fullName.toLowerCase().includes(this.searchName.toLowerCase())) &&
      (this.searchPhone === '' || teacher.phoneNumber.includes(this.searchPhone))
    );
  }
}
