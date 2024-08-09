import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

private url: string ="";
  
   constructor(private httpClient: HttpClient) {}

    public postRequest(endpoint: string, data: any, token: string | null): Observable<any> {
    const headers = new HttpHeaders({
      "Authorization": `Bearer ${token}`,
      "Content-type": "application/json",
      "ngrok-skip-browser-warning": "6024"
    });
    return this.httpClient.post(`${this.url}${endpoint}`, JSON.stringify(data), { headers: headers })
  }

   public postFormData(endpoint: string, formData: any, token: string | null = null): Observable<any> {
    let headers = new HttpHeaders({
      "ngrok-skip-browser-warning": "6024"
    });

    if (token) {
      headers = headers.append("Authorization", `Bearer ${token}`);
    }

    return this.httpClient.post(`${this.url}${endpoint}`, formData, { headers: headers})

  }
}
