import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, retry } from 'rxjs';
import { PerformanceResponse, StudentPerformance, User, UserDetailsResponse } from '../interfaces/interfaces';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class StudentPerformanceService {
  constructor(private http: HttpClient) { }

  getPerformance(): Observable<StudentPerformance[]> {
    return this.http.get<PerformanceResponse>(environment.getPerformanceEndpoint).pipe(
      retry(1),
      map((response: PerformanceResponse) => {
        return response.body?.StudentsPerformance || [];
      })
    );
  }

  getUserDetails(): Observable<User[]> {
    return this.http.get<UserDetailsResponse>(environment.getuserDetailsEndpoint).pipe(
      retry(1),
      map((response: UserDetailsResponse) => {
        return response.body?.Students || [];
      })
    );
  }
}