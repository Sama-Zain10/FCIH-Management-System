import { Routes } from '@angular/router';
import { AuthDemoComponent } from './components/auth-demo/auth-demo.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CourseRegistrationComponent } from './components/course-registration/course-registration.component';
import { ScheduleComponent } from './components/schedule/schedule';
import { Grades } from './components/grades/grades';
import { UserManagement } from './components/admin/user-management/user-management';
import { CourseManagement } from './components/admin/course-management/course-management';
import { GradeManagement } from './components/admin/grade-management/grade-management';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'demo', component: AuthDemoComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'home', component: HomeComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'courses', component: CourseRegistrationComponent },
    { path: 'schedule', component: ScheduleComponent },
    { path: 'grades', component: Grades },
    { path: 'admin/dashboard', component: HomeComponent },
    { path: 'admin/users', component: UserManagement },
    { path: 'admin/courses', component: CourseManagement },
    { path: 'admin/grades', component: GradeManagement },
    { path: '**', component: NotFoundComponent }
];