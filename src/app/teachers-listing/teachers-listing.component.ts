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
  selectedTeacher: any = null;
  searchID: string = '';
  searchName: string = '';
  searchPhone: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;

  constructor(private service: ServicesService, private sessionService: SessionService) {}

  ngOnInit() {
    this.fetchTeachers();
  }

  fetchTeachers() {
    const token = this.sessionService.getToken();
    this.service.getRequest('/api/admins/teachers', token).subscribe(
      (data) => {
        this.teachers = data;
        this.totalPages = Math.ceil(this.teachers.length / this.pageSize);
        this.teachers.forEach((teacher) => {
          teacher.isEditing = false; // Initialize editing state
        });
      },
      (error) => {
        console.error('Error fetching teachers', error);
      }
    );
  }

  paginatedTeachers() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredTeachers().slice(start, end);
  }

  filteredTeachers() {
    return this.teachers.filter(
      (teacher) =>
        (this.searchID === '' || teacher.idNumber.includes(this.searchID)) &&
        (this.searchName === '' || teacher.fullName.toLowerCase().includes(this.searchName.toLowerCase())) &&
        (this.searchPhone === '' || teacher.phoneNumber.includes(this.searchPhone))
    );
  }

  selectTeacher(teacher: any) {
    this.selectedTeacher = { ...teacher }; // Create a copy to allow editing
  }

  closeDetails() {
    this.selectedTeacher = null;
  }

  editTeacher() {
    if (this.selectedTeacher) {
      this.selectedTeacher.isEditing = true;
    }
  }

  cancelEdit() {
    if (this.selectedTeacher) {
      this.selectedTeacher.isEditing = false;
      this.selectedTeacher = null; // Reset selected teacher
      this.fetchTeachers(); // Refresh data to cancel changes
    }
  }

  saveTeacher() {
    if (this.selectedTeacher) {
      const updatedTeacher = { ...this.selectedTeacher };
      const token = this.sessionService.getToken();
      this.service.putRequest(`/api/admins/teachers/profile/${this.selectedTeacher.id}`, updatedTeacher, token).subscribe(
        (data) => {
          alert('Teacher details updated successfully');
          this.selectedTeacher.isEditing = false;
          this.selectedTeacher = null; // Reset selected teacher
          this.fetchTeachers(); // Refresh list after update
        },
        (error) => {
          console.error('Error updating teacher details', error);
        }
      );
    }
  }

deleteTeacher() {
  if (this.selectedTeacher) {
    if (confirm('Are you sure you want to delete this teacher?')) {
      const token = this.sessionService.getToken();
      this.service.deleteRequest(`/api/admins/teachers/profile/${this.selectedTeacher.id}`, token).subscribe(
        (data) => {
          alert('Teacher deleted successfully');
          this.selectedTeacher = null;
          this.fetchTeachers(); // Refresh list after deletion
        },
        (error) => {
          console.error('Error deleting teacher', error);
        }
      );
    }
  }
}


  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
}
