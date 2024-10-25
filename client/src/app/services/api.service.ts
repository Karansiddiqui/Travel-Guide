import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:7000';

  constructor(private http: HttpClient) {}

  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/v1/auth/register`, userData);
  }
  login(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/v1/auth/login`, userData, {
      withCredentials: true,
    });
  }
  logout(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/v1/auth/logout`, {
      withCredentials: true,
    });
  }
}
