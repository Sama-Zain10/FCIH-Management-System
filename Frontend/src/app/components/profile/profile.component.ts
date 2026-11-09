import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { StudentService, StudentProfile } from '../../services/student';
import { forkJoin } from 'rxjs';
interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  studentId: string;
  academicLevel: string;
  major: string;
  degree: string;
  gpa: number;
  creditsEarned: number;
  totalCredits: number;
  status: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit, OnDestroy {

  profile: UserProfile = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    studentId: '',
    academicLevel: '',
    major: '',
    degree: '',
    gpa: 0,
    creditsEarned: 0,
    totalCredits: 120,
    status: ''
  };

  isEditing = false;
  creditsPercent = 0;
  loading = false;
  errorMessage = '';

  constructor(
    private studentService: StudentService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService
  ) {
    console.log('Profile Component Created');
  }

  ngOnInit(): void {
    console.log('Profile ngOnInit');
    this.loadProfile();
  }

  ngOnDestroy(): void {
    console.log('Profile Destroyed');
  }
  loadProfile(): void {

    this.loading = true;
    this.errorMessage = '';

    forkJoin({
      profile: this.studentService.getProfile(),
      grades: this.studentService.getMyGrades()
    }).subscribe({

      next: ({ profile, grades }) => {

        console.log('Profile From API:', profile);
        console.log('Grades From API:', grades);

        const gradePoints: Record<string, number> = {
          'A': 4,
          'A-': 3.7,
          'B+': 3.3,
          'B': 3,
          'B-': 2.7,
          'C+': 2.3,
          'C': 2,
          'C-': 1.7,
          'D': 1,
          'F': 0
        };

        let totalCredits = 0;
        let totalPoints = 0;

        grades.forEach(grade => {

          if (!grade.letter) return;

          const credits = grade.courseId.credits || 0;
          const points = gradePoints[grade.letter] ?? 0;

          totalCredits += credits;
          totalPoints += credits * points;

        });

        const gpa =
          totalCredits > 0
            ? +(totalPoints / totalCredits).toFixed(2)
            : 0;

        let status = 'Probation';

        if (gpa >= 3.7) {
          status = 'Excellent Standing';
        } else if (gpa >= 3) {
          status = 'Good Standing';
        } else if (gpa >= 2) {
          status = 'Warning';
        }

        this.profile = {
          firstName: profile.name?.split(' ')[0] || '',
          lastName: profile.name?.split(' ').slice(1).join(' ') || '',
          email: profile.email || '',
          phone: '',
          dateOfBirth: '',
          studentId: profile.studentId || '',
          academicLevel: 'Current Student',
          major: profile.department || '',
          degree: profile.role === 'admin' ? 'Administrator' : 'Student',
          gpa,
          creditsEarned: totalCredits,
          totalCredits: 120,
          status
        };

        this.creditsPercent =
          (this.profile.creditsEarned / this.profile.totalCredits) * 100;

        this.loading = false;

        this.toastr.success(
          'Profile loaded successfully'
        );

        this.cdr.detectChanges();

      },

      error: (err) => {

        console.log(err);

        this.errorMessage = 'Unable to load profile';
        this.loading = false;

        this.toastr.error(
          'Error to load profile'
        );

        this.cdr.detectChanges();

      }

    });

  }

  editProfile(): void {
    this.isEditing = true;
  }

  saveProfile(): void {

    this.loading = true;

    this.studentService.updateProfile({

      name: `${this.profile.firstName} ${this.profile.lastName}`.trim(),
      email: this.profile.email,
      department: this.profile.major

    }).subscribe({

      next: () => {

        this.isEditing = false;
        this.loading = false;

        this.toastr.success(
          'Profile updated successfully',
        );

        this.cdr.detectChanges();

      },

      error: (err) => {

        console.log(err);

        this.errorMessage = 'Unable to save profile';
        this.loading = false;

        this.toastr.error(
          'Update Failed'
        );

        this.cdr.detectChanges();

      }

    });

  }

  cancelEdit(): void {
    this.isEditing = false;
  }

  getInitial(): string {
    return this.profile.firstName.charAt(0);
  }

  getStatusColor(): string {
    return this.profile.status === 'GOOD STANDING'
      ? 'good'
      : 'warning';
  }

}