import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StudentsPerformanceComponent } from './components/students-performance/students-performance.component';
import { canActivate } from './auth.guard';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent }, //#TODO fix amplify after login
  { path: 'students-performance', component: StudentsPerformanceComponent, canActivate: [canActivate] },
  { path: '**', component: DashboardComponent } //#TODO page not found 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }