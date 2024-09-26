import { Injectable } from '@angular/core'; 
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Student } from '../students/student.model';

@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  private url: string = 'https://schoolapp-pkeb.onrender.com';

  constructor(private httpClient: HttpClient) {}

  // POST request with JSON data
  public postRequest(endpoint: string, data: any, token: string | null): Observable<any> {
    const headers = this.createHeaders(token);
    return this.httpClient
      .post(`${this.url}${endpoint}`, data, { headers })
      .pipe(catchError(this.handleError));
  }

  // POST request with FormData (for file uploads)
  public postFormData(endpoint: string, formData: FormData, token: string | null = null): Observable<any> {
    const headers = this.createHeaders(token, true);
    return this.httpClient
      .post(`${this.url}${endpoint}`, formData, { headers })
      .pipe(catchError(this.handleError));
  }

  // GET request
  public getRequest(endpoint: string, token: string | null = null): Observable<any> {
    const headers = this.createHeaders(token);
    return this.httpClient
      .get(`${this.url}${endpoint}`, { headers })
      .pipe(catchError(this.handleError));
  }

  // GET students data
  public getStudents(token: string | null = null): Observable<{ data: Student[] }> {
    const headers = this.createHeaders(token);
    return this.httpClient
      .get<{ data: Student[] }>(`${this.url}/api/admins/students`, { headers })
      .pipe(catchError(this.handleError));
  }

  // Upload profile picture
  public uploadProfilePicture(teacherId: string, formData: FormData, token: string | null = null): Observable<any> {
    const headers = this.createHeaders(token, true);
    return this.httpClient
      .post(`${this.url}/api/open/teachers/pfp/${teacherId}`, formData, { headers })
      .pipe(catchError(this.handleError));
  }

  // Get profile picture URL
  public getProfilePicture(studentId: number, token: string | null = null): Observable<{ imgUrl: string }> {
    const headers = this.createHeaders(token);
    return this.httpClient
      .get<{ imgUrl: string }>(`${this.url}/api/admins/students/profile/${studentId}`, { headers })
      .pipe(catchError(this.handleError));
  }

  // PUT request (for updating data)
  public putRequest(endpoint: string, data: any, token: string | null): Observable<any> {
    const headers = this.createHeaders(token);
    return this.httpClient
      .put(`${this.url}${endpoint}`, data, { headers })
      .pipe(catchError(this.handleError));
  }

  // DELETE request
  public deleteRequest(endpoint: string, token: string | null): Observable<any> {
    const headers = this.createHeaders(token);
    return this.httpClient
      .delete(`${this.url}${endpoint}`, { headers })
      .pipe(catchError(this.handleError));
  }

  
// Create headers method
private createHeaders(token: string | null, isFormData: boolean = false): HttpHeaders {
  let headers = new HttpHeaders({
    'ngrok-skip-browser-warning': '6024',  // Optional custom header
  });

  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  // Do not set 'Content-Type' for FormData, as the browser handles it
  if (!isFormData) {
    headers = headers.set('Content-Type', 'application/json');
  }

  return headers;
}


  // Handle errors
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
