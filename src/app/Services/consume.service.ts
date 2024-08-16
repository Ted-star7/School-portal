import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  private url: string = 'https://9f59-41-80-117-245.ngrok-free.app'; 

  constructor(private httpClient: HttpClient) {}

  public postRequest(endpoint: string, data: any, token: string | null): Observable<any> {
    const headers = this.createHeaders(token);

    return this.httpClient
      .post(`${this.url}${endpoint}`, data, { headers })
      .pipe(catchError(this.handleError));
  }

  public postFormData(endpoint: string, formData: FormData, token: string | null = null): Observable<any> {
    const headers = this.createHeaders(token, true); // Allow FormData to use default headers

    return this.httpClient
      .post(`${this.url}${endpoint}`, formData, { headers })
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
    // Customize your error handling here
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
