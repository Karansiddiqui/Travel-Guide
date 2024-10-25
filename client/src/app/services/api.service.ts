// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class ApiService {

//   constructor() { }
// }


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:7000';  // base URL for API

  constructor(private http: HttpClient) {}

  // Method to register a user
  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/v1/auth/register`, userData);
  }
  login(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/v1/auth/login`, userData);
  }
}
