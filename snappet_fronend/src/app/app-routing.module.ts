import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StudentsPerformanceComponent } from './components/students-performance/students-performance.component';
import { canActivate } from './auth.guard';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent }, //#TODO fix amplify after login & canactivate conflict
  { path: 'students-performance', component: StudentsPerformanceComponent, canActivate: [canActivate] },
  { path: '**', component: DashboardComponent },//#TODO page not found
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }