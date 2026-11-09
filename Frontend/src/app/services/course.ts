import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';

const API_BASE_URL = 'http://localhost:3000';

export interface AppCourse {
  _id: string;
  name: string;
  code: string;
  description?: string;
  instructor: string;
  credits: number;
  capacity?: number;
  enrolledCount?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private baseUrl = `${API_BASE_URL}/course`;

  constructor(private http: HttpClient) { }

  getAllCourses(): Observable<AppCourse[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      map((courses) =>
        courses.map(course => ({
          _id: course._id,
          name: course.name,
          code: course.code,
          instructor: course.instructor,
          credits: course.credits,
          capacity: course.capacity,
          enrolledCount: course.enrolledCount,
          description: course.description
        })
        )),
      catchError(this.handleError)
    );
  }

  addCourse(data: Partial<AppCourse>): Observable<AppCourse> {
    const payload = {
      name: data.name,
      code: data.code,
      instructor: data.instructor,
      credits: data.credits,
      capacity: data.capacity,
      description: data.description
    };
    return this.http.post<AppCourse>(`${this.baseUrl}/add-course`, payload).pipe(catchError(this.handleError));
  }

  updateCourse(id: string, data: Partial<AppCourse>): Observable<AppCourse> {
    const payload = {
      name: data.name,
      code: data.code,
      instructor: data.instructor,
      credits: data.credits,
      capacity: data.capacity,
      description: data.description
    };
    return this.http.patch<AppCourse>(`${this.baseUrl}/${id}`, payload).pipe(catchError(this.handleError));
  }

  deleteCourse(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    const message = error?.error?.message || error?.message || error?.statusText;
    return throwError(() => message || 'Unable to reach the server. Make sure the backend is running on port 3000.');
  }
}