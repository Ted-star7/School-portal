import { Component, OnInit, inject } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { ServicesService } from '../Services/consume.service';
import { SessionService } from '../Services/session.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-photo-library',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './photo-library.component.html',
  styleUrls: ['./photo-library.component.css'],
})
export class PhotoLibraryComponent implements OnInit {
  galleryPhotos: any[] = [];
  displayedPhotos: any[] = []; // Photos to display on the current page
  token: string | null = null;
  selectedFile: File | null = null;
  shortDescription: string = '';
  currentPage: number = 1; // Current page number
  itemsPerPage: number = 12; // Number of items per page
  totalPages: number = 0; // Total number of pages
  selectedImage: string | null = null; // Selected image for the modal
  service = inject(ServicesService); 
  sessionService = inject(SessionService);

  ngOnInit(): void {
    this.token = this.sessionService.getToken();
    this.loadGallery();
  }

  // Load the gallery photos
  loadGallery(): void {
    if (this.token) {
      this.service.getGallery(this.token).subscribe({
        next: (photos) => {
          this.galleryPhotos = photos;
          this.totalPages = Math.ceil(this.galleryPhotos.length / this.itemsPerPage); // Calculate total pages
          this.updateDisplayedPhotos(); // Update photos for the current page
        },
        error: (error) => {
          console.error('Failed to load gallery:', error);
        },
      });
    } else {
      console.error('No token found. Unable to load the gallery.');
    }
  }

  // Update the displayed photos based on the current page
  updateDisplayedPhotos(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage; // Calculate the start index
    const endIndex = startIndex + this.itemsPerPage; // Calculate the end index
    this.displayedPhotos = this.galleryPhotos.slice(startIndex, endIndex); // Get the photos for the current page
  }

  // Handle file selection for upload
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0]; // Get the selected file
  }

  // Upload the selected file with the short description
  uploadPhoto(): void {
    if (this.selectedFile && this.shortDescription && this.token) {
      const formData = new FormData();
      formData.append('image', this.selectedFile); // Append the image file
      formData.append('shortDescription', this.shortDescription); // Append the short description
      this.service.postFormData('/api/gallery', formData, this.token).subscribe({
        next: (response) => {
          console.log('Photo uploaded successfully:', response);
          this.loadGallery(); // Refresh the gallery after successful upload
        },
        error: (error) => {
          console.error('Failed to upload photo:', error);
        },
      });
    } else {
      console.error('Please select a file, enter a description, and ensure the token is valid.');
    }
  }

  // Delete a photo
  deletePhoto(photoId: number): void {
    if (confirm('Are you sure you want to delete this photo?')) {
      if (this.token) {
        this.service.deletePhoto(photoId, this.token).subscribe({
          next: () => {
            this.galleryPhotos = this.galleryPhotos.filter((photo) => photo.id !== photoId);
            console.log('Photo deleted successfully');
            this.updateDisplayedPhotos(); // Update displayed photos after deletion
          },
          error: (error) => {
            console.error('Failed to delete photo:', error);
          },
        });
      } else {
        console.error('No token found. Unable to delete the photo.');
      }
    }
  }

  // Open modal with selected image
  openModal(photo: any): void {
    this.selectedImage = photo.imageUrl; // Set the selected image
  }

  // Close modal
  closeModal(): void {
    this.selectedImage = null; // Reset the selected image
  }

  // Navigate to the previous page
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedPhotos(); // Update photos for the new page
    }
  }

  // Navigate to the next page
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedPhotos(); // Update photos for the new page
    }
  }
}
