import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Amplify } from 'aws-amplify';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';
import { AppComponent } from './app/app.component';
import awsconfig from './aws-exports';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardComponent } from './app/components/dashboard/dashboard.component';
import { NgChartsModule } from 'ng2-charts';
import { AppRoutingModule } from './app/app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NotificationComponent } from './app/components/notification/notification.component';
import { StudentsPerformanceComponent } from './app/components/students-performance/students-performance.component';
import { LoaderComponent } from './app/components/loader/loader.component';
import { ApiGatewayInterceptor } from './app/api-gateway-interceptor';

Amplify.configure(awsconfig);

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <---this right here
  declarations: [AppComponent, DashboardComponent, NotificationComponent, StudentsPerformanceComponent, LoaderComponent],
  imports: [BrowserModule, AmplifyAuthenticatorModule, NgbModule, NgChartsModule, AppRoutingModule, HttpClientModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ApiGatewayInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
