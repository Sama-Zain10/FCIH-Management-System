import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

import { AuthResponse, LoginPayload, SignupPayload } from '../models/auth.model';
const API_BASE_URL = 'http://localhost:3000';

interface DecodedUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = API_BASE_URL;
  private readonly tokenKey = 'auth_token';

  constructor(private http: HttpClient) { }

  login(payload: LoginPayload) {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/auth/login`, payload)
      .pipe(
        tap((response) => {
          if (response.token) {
            this.setToken(response.token);
          }
        }),
        catchError(this.handleError)
      );
  }

  signup(payload: SignupPayload) {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/auth/signup`, payload)
      .pipe(catchError(this.handleError));
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }

  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): DecodedUser | null {
  const token = this.getToken();
  if (!token) return null;

  try {
    const user = jwtDecode<any>(token);
    return user;
  } catch {
    return null;
  }
}

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  private handleError(error: any) {
    const message = error?.error?.message || error?.message || error?.statusText;
    const fallback = message || 'Unable to reach the server. Make sure the backend is running on port 3000.';
    return throwError(() => fallback);
  }
}