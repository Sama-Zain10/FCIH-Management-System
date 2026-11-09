import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CourseService, AppCourse } from '../../services/course';
import { StudentService } from '../../services/student';

interface Course {
  id: string;
  code: string;
  name: string;
  section: string;
  credits: number;
  instructor: string;
  instructorInitial: string;
  status: 'REGISTERED' | 'OPEN' | 'FULL';
  action?: 'Drop' | 'Register' | 'Waitlist';
}

interface RegistrationInfo {
  semester: string;
  status: string;
  creditsUsed: number;
  maxCredits: number;
  priorityEnrollment: boolean;
}

@Component({
  selector: 'app-course-registration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './course-registration.component.html',
  styleUrl: './course-registration.component.css'
})
export class CourseRegistrationComponent implements OnInit, OnDestroy {

  registrationInfo: RegistrationInfo = {
    semester: 'Fall 2026',
    status: 'REGISTRATION OPEN',
    creditsUsed: 14,
    maxCredits: 18,
    priorityEnrollment: true
  };

  courses: Course[] = [];
  filteredCourses: Course[] = [];

  creditsPercent = 0;
  searchTerm = '';
  loading = false;
  errorMessage = '';

  constructor(
    private courseService: CourseService,
    private studentService: StudentService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService
  ) {
    console.log('Course Registration Component Created');
  }

  ngOnInit(): void {
    console.log('Course Registration ngOnInit');

    this.loadCourses();

    this.creditsPercent =
      (this.registrationInfo.creditsUsed / this.registrationInfo.maxCredits) * 100;
  }

  ngOnDestroy(): void {
    console.log('Course Registration Destroyed');
  }
loadCourses(): void {

  this.loading = true;
  this.errorMessage = '';
  this.courseService.getAllCourses().subscribe({

    next: (allCourses: AppCourse[]) => {

      this.studentService.getMyCourses().subscribe({

        next: (myCourses) => {
          console.log(myCourses);
          
          const enrolledIds = myCourses.map(course => course._id);

          this.courses = allCourses.map((course) => {

            const registered = enrolledIds.includes(course._id);

            return {
              id: course._id,
              code: course.code,
              name: course.name,
              section: `${course.code} • Section A`,
              credits: course.credits,
              instructor: course.instructor,
              instructorInitial: course.instructor.charAt(0).toUpperCase(),

              status: registered ? 'REGISTERED' : 'OPEN',
              action: registered ? 'Drop' : 'Register'
            };

          });

          this.filteredCourses = [...this.courses];

          this.loading = false;

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.log(err);

          this.errorMessage = 'Unable to load enrolled courses';
          this.loading = false;

          this.toastr.error('Unable to load enrolled courses');

          this.cdr.detectChanges();

        }

      });

    },

    error: (err) => {

      console.log(err);

      this.errorMessage = 'Unable to load courses';
      this.loading = false;

      this.toastr.error('Unable to load courses');

      this.cdr.detectChanges();

    }

  });

}

  getInstructorColor(initial: string): string {

    const colors: { [key: string]: string } = {
      C: '#c084fc',
      J: '#a78bfa',
      V: '#a78bfa',
      R: '#f087b2',
      K: '#60a5fa'
    };

    return colors[initial] || '#6366f1';

  }

  getStatusBadgeClass(status: string): string {
    return status.toLowerCase().replace(' ', '-');
  }

  getActionButtonClass(action: string): string {

    if (action === 'Drop') return 'drop-btn';
    if (action === 'Register') return 'register-btn';
    if (action === 'Waitlist') return 'waitlist-btn';

    return '';

  }
    onAction(course: Course, actionType: string): void {

    if (actionType === 'Register') {

      this.studentService.enrollInCourse(course.id).subscribe({

        next: () => {

          course.status = 'REGISTERED';
          course.action = 'Drop';

          this.registrationInfo.creditsUsed += course.credits;

          this.creditsPercent =
            (this.registrationInfo.creditsUsed / this.registrationInfo.maxCredits) * 100;

          this.toastr.success(`${course.name} registered successfully`);

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.log(err);

          this.toastr.error('Unable to register for this course');

        }

      });

    } else if (actionType === 'Drop') {

      this.studentService.unenrollFromCourse(course.id).subscribe({

        next: () => {

          course.status = 'OPEN';
          course.action = 'Register';

          this.registrationInfo.creditsUsed -= course.credits;

          this.creditsPercent =
            (this.registrationInfo.creditsUsed / this.registrationInfo.maxCredits) * 100;

          this.toastr.success(`${course.name} dropped successfully`);

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.log(err);

          this.toastr.error('Unable to drop this course');

        }

      });

    } else {

      course.status = 'OPEN';
      course.action = 'Register';

      this.toastr.info(
        `You have been added to the waitlist for ${course.name}`
      );

      this.cdr.detectChanges();

    }

  }

  filterCourses(): void {

    const term = this.searchTerm.toLowerCase();

    this.filteredCourses = this.courses.filter(course =>
      course.name.toLowerCase().includes(term) ||
      course.code.toLowerCase().includes(term) ||
      course.instructor.toLowerCase().includes(term)
    );

    this.cdr.detectChanges();

  }

}