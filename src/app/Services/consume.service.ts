import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Student } from '../students/student.model';

@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  private url: string = 'https://d7e8-41-80-116-234.ngrok-free.app';

  constructor(private httpClient: HttpClient) {}

  public postRequest(endpoint: string, data: any, token: string | null): Observable<any> {
    const headers = this.createHeaders(token);
    return this.httpClient
      .post(`${this.url}${endpoint}`, data, { headers })
      .pipe(catchError(this.handleError));
  }

  public postFormData(endpoint: string, formData: FormData, token: string | null = null): Observable<any> {
    const headers = this.createHeaders(token, true);
    return this.httpClient
      .post(`${this.url}${endpoint}`, formData, { headers })
      .pipe(catchError(this.handleError));
  }

  public getRequest(endpoint: string, token: string | null = null): Observable<any> {
    const headers = this.createHeaders(token);
    return this.httpClient
      .get(`${this.url}${endpoint}`, { headers })
      .pipe(catchError(this.handleError));
  }

  public getStudents(token: string | null = null): Observable<Student[]> {
    const headers = this.createHeaders(token);
    return this.httpClient
      .get<Student[]>(`${this.url}/api/admins/students`, { headers })
      .pipe(catchError(this.handleError));
  }

  public uploadProfilePicture(teacherId: string, formData: FormData, token: string | null = null): Observable<any> {
    const headers = this.createHeaders(token, true);
    return this.httpClient
      .post(`${this.url}/api/open/teachers/pfp/${teacherId}`, formData, { headers })
      .pipe(catchError(this.handleError));
  }

  public getProfilePicture(studentId: number, token: string | null = null): Observable<any> {
    const headers = this.createHeaders(token);
    return this.httpClient
      .get(`${this.url}/api/students/pfp/${studentId}`, { headers })
      .pipe(catchError(this.handleError));
  }

  private createHeaders(token: string | null, isFormData: boolean = false): HttpHeaders {
    let headers = new HttpHeaders({
      'ngrok-skip-browser-warning': '6024',
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    if (!isFormData) {
      headers = headers.set('Content-Type', 'application/json');
    }

    return headers;
  }

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
