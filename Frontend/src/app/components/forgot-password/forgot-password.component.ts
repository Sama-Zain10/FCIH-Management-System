import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  currentStep = 1;
  submitted = false;

  email = '';
  verificationCode = '';
  password = '';
  confirmPassword = '';

  errorMessage = '';

  // ===== New UI Variables =====
  loading = false;
  otpSent = false;

  private apiUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) {}

  get passwordsDoNotMatch(): boolean {
    return this.password !== this.confirmPassword &&
           this.confirmPassword.length > 0;
  }

  submitEmail(form: NgForm): void {

    this.submitted = true;
    this.errorMessage = '';

    if (form.invalid) {
      return;
    }

    this.loading = true;

    this.http.post(`${this.apiUrl}/forgot-password`, {
      email: this.email
    }).subscribe({

      next: () => {

        this.loading = false;

        this.otpSent = true;

        this.submitted = false;

        setTimeout(() => {

          this.currentStep = 2;

          this.otpSent = false;

        }, 2000);

      },

      error: (err) => {

        this.loading = false;

        this.currentStep = 1;

        this.errorMessage =
          err.error?.message || 'Something went wrong';

      }

    });

  }
    submitCode(form: NgForm): void {

    this.submitted = true;
    this.errorMessage = '';

    if (form.invalid) {
      return;
    }

    this.http.post(`${this.apiUrl}/verify-code`, {
      email: this.email,
      code: this.verificationCode
    }).subscribe({

      next: () => {

        this.currentStep = 3;
        this.submitted = false;

      },

      error: (err) => {

        this.errorMessage =
          err.error?.message || 'Invalid verification code';

      }

    });

  }

  submitPassword(form: NgForm): void {

    this.submitted = true;
    this.errorMessage = '';

    if (form.invalid || this.passwordsDoNotMatch) {
      return;
    }

    this.http.post(`${this.apiUrl}/reset-password`, {
      email: this.email,
      code: this.verificationCode,
      password: this.password
    }).subscribe({

      next: () => {

        this.currentStep = 4;
        this.submitted = false;

      },

      error: (err) => {

        this.errorMessage =
          err.error?.message || 'Something went wrong';

      }

    });

  }

}