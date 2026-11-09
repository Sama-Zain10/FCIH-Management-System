import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CourseService, AppCourse } from '../../../services/course';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-course-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './course-management.html',
  styleUrl: './course-management.css'
})
export class CourseManagement implements OnInit {

  private courseService = inject(CourseService);

  courses: AppCourse[] = [];
  loading = true;
  errorMsg = '';

  showEditModal = false;
  isNewCourse = false;
  selectedCourse: AppCourse | null = null;

  showDeleteConfirm = false;
  courseToDelete: AppCourse | null = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadCourses();
  }


  loadCourses(): void {

    this.loading = true;

    this.courseService.getAllCourses().subscribe({
      next: (data) => {
        console.log("Courses From API:", data);
        this.courses = data;
        this.loading = false;
        this.cdr.markForCheck();
      },

      error: (err) => {
        console.log(err);
        this.errorMsg = 'Failed to load courses';
        this.loading = false;
        this.toastr.error('Failed to load courses', 'Error');
        this.cdr.markForCheck();
      }
    });

  }


  refreshCoursesSilently(): void {

    this.courseService.getAllCourses().subscribe({
      next: (data) => {
        this.courses = data;
        this.cdr.markForCheck();
      },

      error: (err) => {
        console.log(err);
        this.toastr.error('Failed to refresh courses', 'Error');
      }
    });

  }


  openAdd(): void {

    this.isNewCourse = true;

    this.selectedCourse = {
      _id: '',
      name: '',
      code: '',
      instructor: '',
      credits: 3,
      capacity: 30
    };

    this.showEditModal = true;
  }


  openEdit(course: AppCourse): void {

    this.isNewCourse = false;

    this.selectedCourse = { ...course };

    this.showEditModal = true;
  }


  closeEdit(): void {

    this.showEditModal = false;
    this.selectedCourse = null;
    this.cdr.markForCheck();

  }


  saveCourse(): void {

    if (!this.selectedCourse) return;

    if (this.isNewCourse) {

      this.courseService.addCourse(this.selectedCourse)
        .subscribe({

          next: () => {

            this.toastr.success('Course added successfully', 'Success');

            this.refreshCoursesSilently();

            // بنأخر إغلاق المودال عشان منتعارضش مع الـ CD cycle بتاع progress bar الـ toast (NG0100)
            setTimeout(() => {
              this.closeEdit();
            });

          },

          error: (err) => {
            console.log(err);
            this.toastr.error('Failed to add course', 'Error');
          }

        });

    } else {

      this.courseService.updateCourse(
        this.selectedCourse._id,
        this.selectedCourse
      )
        .subscribe({

          next: () => {

            this.toastr.success('Course updated successfully', 'Success');

            this.refreshCoursesSilently();

            setTimeout(() => {
              this.closeEdit();
            });

          },

          error: (err) => {
            console.log(err);
            this.toastr.error('Failed to update course', 'Error');
          }

        });

    }

  }


  confirmDelete(course: AppCourse): void {

    this.courseToDelete = course;

    this.showDeleteConfirm = true;

  }


  cancelDelete(): void {

    this.courseToDelete = null;

    this.showDeleteConfirm = false;

    this.cdr.markForCheck();

  }


  deleteCourse(): void {

    if (!this.courseToDelete) return;

    this.courseService.deleteCourse(this.courseToDelete._id)
      .subscribe({

        next: () => {

          this.courses = this.courses.filter(
            c => c._id !== this.courseToDelete!._id
          );

          this.toastr.success('Course deleted successfully', 'Success');

          this.cdr.markForCheck();

          setTimeout(() => {
            this.cancelDelete();
          });

        },

        error: (err) => {
          console.log(err);
          this.toastr.error('Failed to delete course', 'Error');
        }

      });

  }

}