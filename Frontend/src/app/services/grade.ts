import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';

const API_BASE_URL = 'http://localhost:3000';

export interface AppGrade {
  _id: string;
  studentId: string;
  courseId: string;
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  courseCode: string;
  grade: string;
  score?: number | null;
  semester?: string;
  status: 'In Progress' | 'Completed' | 'Failed';
}

@Injectable({
  providedIn: 'root'
})
export class GradeService {
  private baseUrl = `${API_BASE_URL}/grade`;

  constructor(private http: HttpClient) { }

  getAllGrades(): Observable<AppGrade[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      map((grades) => grades.map((grade): AppGrade => ({
        _id: grade._id,
        studentId: grade.studentId,
        courseId: grade.courseId,
        studentName: grade.studentName || 'Unknown student',
        studentEmail: grade.studentEmail || '',
        courseTitle: grade.courseTitle || 'Unknown course',
        courseCode: grade.courseCode || '',
        grade: grade.grade || '-',
        score: grade.score ?? null,
        semester: grade.semester || '',
        status: grade.status || 'In Progress'
      }))),
      catchError(this.handleError)
    );
  }

  addGrade(data: {
    studentId: string;
    courseId: string;
    score?: number;
    letter?: string;
    semester?: string;
    status?: string;
  }): Observable<any> {
    return this.http.post(this.baseUrl, data).pipe(
      catchError(this.handleError)
    );
  }

  updateGrade(id: string, data: {
    score?: number;
    letter?: string;
    semester?: string;
    status?: string;
  }): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data).pipe(
      catchError(this.handleError)
    );
  }

  deleteGrade(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    const message = error?.error?.message || error?.message || error?.statusText;
    return throwError(() => message || 'Unable to reach the server. Make sure the backend is running on port 3000.');
  }
}