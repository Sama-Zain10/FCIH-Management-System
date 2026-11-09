import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  inject
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { GradeService, AppGrade } from '../../../services/grade';
import { UserService, AppUser } from '../../../services/user';
import { CourseService, AppCourse } from '../../../services/course';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-grade-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './grade-management.html',
  styleUrl: './grade-management.css'
})
export class GradeManagement implements OnInit, OnDestroy {

  private gradeService = inject(GradeService);
  private userService = inject(UserService);
  private courseService = inject(CourseService);

  constructor(
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {
    console.log("Grade Component Created");
  }


  grades: AppGrade[] = [];
  students: AppUser[] = [];
  courses: AppCourse[] = [];

  loading = true;
  errorMsg = '';

  showEditModal = false;
  selectedGrade: AppGrade | null = null;

  showDeleteConfirm = false;
  gradeToDelete: AppGrade | null = null;

  showAddModal = false;


  newGrade = {
    studentId: '',
    courseId: '',
    score: null as number | null,
    letter: 'A',
    semester: '',
    status: 'In Progress'
  };


  gradeOptions = [
    'A',
    'A-',
    'B+',
    'B',
    'B-',
    'C+',
    'C',
    'C-',
    'D',
    'F'
  ];



  ngOnInit(): void {
    console.log("Grade ngOnInit");
    this.loadInitialData();
  }


  ngOnDestroy(): void {
    console.log("Grade Destroyed");
  }



  loadInitialData(): void {

    this.loading = true;

    forkJoin({

      grades: this.gradeService.getAllGrades(),

      users: this.userService.getAllUsers(),

      courses: this.courseService.getAllCourses()

    }).subscribe({

      next: ({ grades, users, courses }) => {

        this.grades = grades;

        this.students =
          users.filter(
            u => u.role === 'student'
          );

        this.courses = courses;

        this.loading = false;

        this.cdr.detectChanges();

      },


      error: (err) => {

        console.log(err);

        this.toastr.error(
          'Failed to load data'
        );

        this.loading = false;

        this.cdr.detectChanges();

      }

    });

  }




  loadGrades(): void {


    this.gradeService.getAllGrades()
      .subscribe({

        next: (data) => {

          this.grades = data;

          this.cdr.detectChanges();

        },


        error: (err) => {

          console.log(err);

          this.toastr.error(
            'Failed to load grades'
          );

        }

      });

  }





  openEdit(grade: AppGrade): void {

    this.selectedGrade = {
      ...grade
    };

    this.showEditModal = true;

  }




  closeEdit(): void {

    this.showEditModal = false;

    this.selectedGrade = null;

    this.cdr.detectChanges();

  }





  saveEdit(): void {


    if (!this.selectedGrade)
      return;



    const payload = {

      score:
        this.selectedGrade.score ?? undefined,

      letter:
        this.selectedGrade.grade,

      semester:
        this.selectedGrade.semester,

      status:
        this.selectedGrade.status

    };



    this.gradeService
      .updateGrade(
        this.selectedGrade._id,
        payload
      )
      .subscribe({

        next: () => {


          this.loadGrades();


          this.toastr.success(
            'Grade updated successfully'
          );


          // بنأخر إغلاق المودال عشان منتعارضش مع
          // الـ change detection cycle بتاع الـ toast (NG0100)
          setTimeout(() => {
            this.closeEdit();
          });


        },


        error: (err) => {


          console.log(err);


          this.toastr.error(
            err.error?.message ||
            err?.message ||
            'Failed to update grade'
          );


        }

      });


  }





  confirmDelete(grade: AppGrade): void {

    this.gradeToDelete = grade;

    this.showDeleteConfirm = true;

  }




  cancelDelete(): void {

    this.gradeToDelete = null;

    this.showDeleteConfirm = false;

    this.cdr.detectChanges();

  }





  deleteGrade(): void {


    if (!this.gradeToDelete)
      return;



    this.gradeService
      .deleteGrade(
        this.gradeToDelete._id
      )
      .subscribe({

        next: () => {


          this.grades =
            this.grades.filter(
              g =>
              g._id !== this.gradeToDelete!._id
            );


          this.toastr.success(
            'Grade deleted successfully'
          );


          this.cdr.detectChanges();


          // بنأخر إقفال مودال التأكيد لنفس سبب NG0100
          setTimeout(() => {
            this.cancelDelete();
          });


        },


        error: (err) => {


          console.log(err);


          this.toastr.error(
            'Failed to delete grade'
          );


        }

      });


  }





  openAddGrade(): void {

    this.showAddModal = true;

  }




  closeAddGrade(): void {


    this.showAddModal = false;


    this.newGrade = {

      studentId: '',

      courseId: '',

      score: null,

      letter: 'A',

      semester: '',

      status: 'In Progress'

    };


    this.cdr.detectChanges();


  }





  addGrade(): void {


    if (
      !this.newGrade.studentId ||
      !this.newGrade.courseId
    ) {


      this.toastr.error(
        'Please select a student and a course'
      );


      return;


    }




    const gradeData = {


      studentId:
        this.newGrade.studentId,


      courseId:
        this.newGrade.courseId,


      score:
        this.newGrade.score ?? undefined,


      letter:
        this.newGrade.letter,


      semester:
        this.newGrade.semester,


      status:
        this.newGrade.status


    };



    console.log(
      "SEND DATA:",
      gradeData
    );




    this.gradeService
      .addGrade(gradeData)
      .subscribe({

        next: () => {


          this.loadGrades();


          this.toastr.success(
            "Grade added successfully"
          );


          // بنأخر إقفال المودال لنفس سبب NG0100
          setTimeout(() => {
            this.closeAddGrade();
          });


        },


        error: (err) => {


          console.log(err);


          this.toastr.error(
            err.error?.message ||
            err?.message ||
            "Failed to add grade"
          );


        }


      });



  }



}