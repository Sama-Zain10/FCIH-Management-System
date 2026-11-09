import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import {
  StudentService,
  StudentGrade,
  StudentCourse,
  StudentProfile
} from '../../services/student';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface CourseGrade {
  courseName: string;
  courseCode: string;
  instructor: string;
  credits: number;
  status: 'Completed' | 'In Progress';
  grade: string;
}

@Component({
  selector: 'app-grades',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grades.html',
  styleUrl: './grades.css'
})
export class Grades implements OnInit {

  cumulativeGPA = 0;
  gpaChange = 0;
  creditsEarned = 0;
  creditsRequired = 120;

  currentSemester = 'Current Semester';
  currentWeek = 0;
  totalWeeks = 16;

  academicStanding = 'Good Standing';
  standingLabel = 'GOOD';

  courses: CourseGrade[] = [];

  loading = false;
  errorMessage = '';

  student!: StudentProfile;

  constructor(
    private studentService: StudentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadGrades();
  }

  loadGrades(): void {

    this.loading = true;
    this.errorMessage = '';

    forkJoin({
      profile: this.studentService.getProfile(),
      courses: this.studentService.getMyCourses(),
      grades: this.studentService.getMyGrades()
    }).subscribe({

      next: ({ profile, courses, grades }) => {

        this.student = profile;

        console.log('Profile API', profile);
        console.log('Courses API', courses);
        console.log('Grades API', grades);

        this.courses = courses.map((course: StudentCourse) => {

          const gradeEntry = grades.find(
            (g: StudentGrade) => g.courseId._id === course._id
          );

          return {
            courseName: course.name,
            courseCode: course.code,
            instructor: course.instructor || 'N/A',
            credits: course.credits || 0,
            status: gradeEntry?.letter ? 'Completed' : 'In Progress',
            grade: gradeEntry?.letter || '-'
          };

        });

        this.calculateStatistics(grades);

        this.loading = false;

        this.cdr.detectChanges();

      },

      error: (err: any) => {

        console.error(err);

        this.errorMessage = 'Unable to load grades';
        this.loading = false;

        this.cdr.detectChanges();

      }

    });

  }

  private calculateStatistics(data: StudentGrade[]) {

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

    let totalPoints = 0;
    let totalCredits = 0;

    data.forEach(item => {

      if (!item.letter) return;

      const course = this.courses.find(
        c => c.courseCode === item.courseId.code
      );

      const credits = course?.credits || 0;
      const points = gradePoints[item.letter] ?? 0;

      totalCredits += credits;
      totalPoints += credits * points;

    });

    this.creditsEarned = totalCredits;

    this.cumulativeGPA =
      totalCredits > 0
        ? +(totalPoints / totalCredits).toFixed(2)
        : 0;

    if (this.cumulativeGPA >= 3.7) {
      this.academicStanding = 'Excellent Standing';
      this.standingLabel = 'EXCELLENT';

    } else if (this.cumulativeGPA >= 3) {
      this.academicStanding = 'Good Standing';
      this.standingLabel = 'GOOD';

    } else if (this.cumulativeGPA >= 2) {
      this.academicStanding = 'Satisfactory';
      this.standingLabel = 'SATISFACTORY';

    } else {
      this.academicStanding = 'At Academic Risk';
      this.standingLabel = 'AT RISK';
    }
  }
    downloadTranscript(): void {

    const doc = new jsPDF('p', 'mm', 'a4');

    // ================= Header =================

    doc.setFillColor(30, 58, 138);
    doc.rect(0, 0, 210, 35, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');

    doc.setFontSize(22);
    doc.text('THE CURATOR', 105, 15, { align: 'center' });

    doc.setFontSize(13);
    doc.text('ACADEMIC SANCTUARY', 105, 24, { align: 'center' });

    doc.setFontSize(17);
    doc.text('OFFICIAL TRANSCRIPT', 105, 32, { align: 'center' });

    // ================= Student Information =================

    doc.setTextColor(0);

    let y = 48;

    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    doc.text('Student Information', 14, y);

    y += 10;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');

    doc.text(`Name: ${this.student.name}`, 14, y);
    y += 7;

    doc.text(`Email: ${this.student.email}`, 14, y);
    y += 7;

    doc.text(`Current GPA: ${this.cumulativeGPA}`, 14, y);
    y += 7;

    doc.text(
      `Credits Earned: ${this.creditsEarned} / ${this.creditsRequired}`,
      14,
      y
    );
    y += 7;

    doc.text(
      `Academic Standing: ${this.academicStanding}`,
      14,
      y
    );

    y += 12;

    // ================= Courses Table =================

    autoTable(doc, {
      startY: y,

      head: [[
        'Course',
        'Code',
        'Instructor',
        'Credits',
        'Status',
        'Grade'
      ]],

      body: this.courses.map(course => [
        course.courseName,
        course.courseCode,
        course.instructor,
        course.credits,
        course.status,
        course.grade
      ]),

      headStyles: {
        fillColor: [30, 58, 138],
        textColor: 255,
        halign: 'center'
      },

      bodyStyles: {
        halign: 'center'
      },

      alternateRowStyles: {
        fillColor: [245, 247, 250]
      }
    });

    // ================= Footer =================

    const pageHeight = doc.internal.pageSize.height;

    doc.setDrawColor(180);
    doc.line(14, pageHeight - 22, 196, pageHeight - 22);

    doc.setFontSize(10);

    doc.text(
      `Generated: ${new Date().toLocaleDateString()}`,
      14,
      pageHeight - 15
    );

    doc.text(
      'The Curator Student Portal',
      196,
      pageHeight - 15,
      { align: 'right' }
    );

    doc.save(`Transcript_${this.student.name}.pdf`);
  }

}