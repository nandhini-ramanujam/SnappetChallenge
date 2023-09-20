import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EngagementSummary, SummaryResponse } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class SummaryService {
  constructor(private http: HttpClient) { }

  getStudentEngagementSummary(): Observable<EngagementSummary> {
    return this.http.get<SummaryResponse>(environment.getEngagementEndpoint).pipe(
      retry(1),
      map((response: SummaryResponse) => {
        return response.body?.Summary;
      })
    );
  }
}