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
import { TeachersListingComponent } from './teachers-listing/teachers-listing.component';
import { ClassesComponent } from './classes/classes.component';
import { ParentsComponent } from './parents/parents.component';
import { AuthGuard } from './auth/auth.guard'; 

export const routes: Routes = [
  { path: '', component: LoginComponent },  // Default route to login
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'resetpassword', component: ResetPasswordComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] }, 
  { path: 'students', component: StudentsComponent, canActivate: [AuthGuard] },
  { path: 'teachers', component: TeachersComponent, canActivate: [AuthGuard] },
  { path: 'attendance', component: AttendanceComponent, canActivate: [AuthGuard] },
  { path: 'exams', component: ExamComponent, canActivate: [AuthGuard] },
  { path: 'subjects', component: SubjectsComponent, canActivate: [AuthGuard] },
  { path: 'attendancechart', component: AttendanceChartComponent, canActivate: [AuthGuard] },
  { path: 'topbar', component: TopbarComponent, canActivate: [AuthGuard] },
  { path: 'teacherslisting', component: TeachersListingComponent, canActivate: [AuthGuard] },
  { path: 'classes', component: ClassesComponent, canActivate: [AuthGuard] },
  { path: 'parents', component: ParentsComponent, canActivate: [AuthGuard] },
];
