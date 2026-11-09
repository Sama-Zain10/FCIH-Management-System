import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';

const API_BASE_URL = 'http://localhost:3000';
export interface AppUser {

  _id: string;

  name: string;

  email: string;

  age: number;

  gender: 'male' | 'female';

  role: 'admin' | 'student';

  studentId?: string;

  department?: string;

  createdAt?: string;

  updatedAt?: string;

}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = `${API_BASE_URL}/admin`;

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<AppUser[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      map((users) => users.map((user) => ({
        _id: user._id,
        name: user.name || 'Unknown user',
        email: user.email || '',
        age: user.age || 0,
        gender: user.gender || 'male',
        role: user.role || 'student',
        studentId: user.studentId,
        department: user.department,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }))),
      catchError(this.handleError)
    );
  }

 updateUser(id: string, data: Partial<AppUser>): Observable<AppUser> {

  const payload = {

    name: data.name,
    email: data.email,
    age: data.age,
    gender: data.gender,
    role: data.role,
    studentId: data.studentId,
    department: data.department

  };


  return this.http.patch<AppUser>(
    `${this.baseUrl}/update/${id}`,
    payload
  )
  .pipe(
    catchError(this.handleError)
  );

}
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`).pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    const message = error?.error?.message || error?.message || error?.statusText;
    return throwError(() => message || 'Unable to reach the server. Make sure the backend is running on port 3000.');
  }
  createUser(data:any){

 return this.http.post<AppUser>(
   `${this.baseUrl}/users`,
   data
 );

}
}