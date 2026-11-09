import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

const API_BASE_URL = 'http://localhost:3000';

export interface StudentProfile {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  studentId?: string;
  department?: string;
  age?: number;
  gender?: string;
}

export interface StudentCourse {
  _id: string;
  name: string;
  code: string;
  instructor?: string;
  credits?: number;
  description?: string;
}

export interface StudentGrade {
  courseId: {
    _id: string;
    name: string;
    code: string;
    instructor?: string;
    credits?: number;
  };
  score: number | null;
  letter: string | null;
  semester: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private baseUrl = `${API_BASE_URL}/student`;

  constructor(private http: HttpClient) { }

  // ================= Profile =================

  getProfile(): Observable<StudentProfile> {
    return this.http
      .get<StudentProfile>(`${this.baseUrl}/profile`)
      .pipe(catchError(this.handleError));
  }

  updateProfile(payload: {
    name: string;
    email: string;
    department: string;
  }): Observable<StudentProfile> {

    return this.http
      .put<StudentProfile>(`${this.baseUrl}/profile`, payload)
      .pipe(catchError(this.handleError));

  }

  // ================= Grades =================

  getMyGrades(): Observable<StudentGrade[]> {
    return this.http
      .get<StudentGrade[]>(`${this.baseUrl}/grades`)
      .pipe(catchError(this.handleError));
  }

  // ================= Courses =================

  getMyCourses(): Observable<StudentCourse[]> {
    return this.http
      .get<StudentCourse[]>(`${this.baseUrl}/courses`)
      .pipe(catchError(this.handleError));
  }

  enrollInCourse(courseId: string): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/courses/${courseId}/enroll`, {})
      .pipe(catchError(this.handleError));
  }

  unenrollFromCourse(courseId: string): Observable<any> {
    return this.http
      .delete(`${this.baseUrl}/courses/${courseId}/unenroll`)
      .pipe(catchError(this.handleError));
  }

  // ================= Error =================

  private handleError(error: any) {
    const message =
      error?.error?.message ||
      error?.message ||
      error?.statusText ||
      'Unable to reach the server.';

    return throwError(() => message);
  }
}