import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from 'aws-amplify';
import { Observable, catchError, from, switchMap } from 'rxjs';

@Injectable()
export class ApiGatewayInterceptor implements HttpInterceptor {

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<any> {
    return from(Auth.currentSession()).pipe(
      switchMap((session) => {
        if (session) {
          const jwtToken = session.getIdToken();
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${jwtToken.getJwtToken()}`,
            },
          });
        }
        return next.handle(request);
      }),
      catchError((error) => {
        return next.handle(request);
      })
    );
  }
}