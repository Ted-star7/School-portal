import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StudentsComponent } from './students/students.component';
import { TeachersComponent } from './teachers/teachers.component';
import { AttendanceChartComponent } from './attendance-chart/attendance-chart.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { ExamComponent } from './exam/exam.component';
import { SubjectsComponent } from './subjects/subjects.component';
import { TopbarComponent } from './topbar/topbar.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { Component } from '@angular/core';


export const routes: Routes = [
  
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'topbar', component: TopbarComponent },
  { path: 'students', component: StudentsComponent },
  { path: 'teachers', component: TeachersComponent },
  { path: 'attendance', component: AttendanceComponent },
  { path: 'exams', component: ExamComponent },
  { path: 'subjects', component: SubjectsComponent },
  { path: 'attendancechart', component: AttendanceChartComponent },
  { path: 'resetpassword', component: ResetPasswordComponent},
  { path: '', component: LoginComponent }, // This should be the last route
];

