import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';
import {
  CourseService,
  AppCourse
} from '../../services/course';

interface ClassSession {
  startTime: string;
  title: string;
  location: string;
  instructor: string;
}

interface DaySchedule {
  day: string;
  accentColor: string;
  sessions: ClassSession[];
}

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './schedule.html',
  styleUrl: './schedule.css'
})
export class ScheduleComponent implements OnInit {

  private courseService = inject(CourseService);

  constructor(
    private cdr: ChangeDetectorRef
  ) {}

  totalCourses = 0;
  totalCredits = 0;
  weeklyHours = 0;

  weekDays: DaySchedule[] = [
    {
      day: 'Monday',
      accentColor: '#6d28d9',
      sessions: []
    },
    {
      day: 'Tuesday',
      accentColor: '#2563eb',
      sessions: []
    },
    {
      day: 'Wednesday',
      accentColor: '#a855f7',
      sessions: []
    },
    {
      day: 'Thursday',
      accentColor: '#f97316',
      sessions: []
    },
    {
      day: 'Friday',
      accentColor: '#06b6d4',
      sessions: []
    }
  ];

  calendarMonth = 'July 2026';

  calendarDays = [
    [29, 30, 1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10, 11, 12],
    [13, 14, 15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24, 25, 26],
    [27, 28, 29, 30, 31, 1, 2]
  ];

  today = 16;
  selectedDay = 16;

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {

    this.courseService
      .getAllCourses()
      .subscribe({

        next: (courses: AppCourse[]) => {

          this.totalCourses = courses.length;

          this.totalCredits = courses.reduce(
            (sum, c) => sum + (c.credits || 0),
            0
          );

          this.weeklyHours = this.totalCredits * 1.5;

          const times = [
            '09:00',
            '10:30',
            '12:00',
            '01:30',
            '03:00'
          ];

          const rooms = [
            'Hall A',
            'Hall B',
            'Lab 1',
            'Lab 2',
            'Room 305',
            'Room 401'
          ];

          this.weekDays.forEach(
            day => day.sessions = []
          );

          courses.forEach((course, index) => {

            const day =
              this.weekDays[
                index % this.weekDays.length
              ];

            day.sessions.push({

              startTime:
                times[
                  Math.floor(
                    Math.random() * times.length
                  )
                ],

              title:
                `${course.code} - ${course.name}`,

              location:
                rooms[
                  Math.floor(
                    Math.random() * rooms.length
                  )
                ],

              instructor:
                course.instructor || 'TBA'

            });

          });

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.log(err);

          this.cdr.detectChanges();

        }

      });

  }

  isCurrentMonthDay(
    day: number,
    rowIndex: number
  ): boolean {

    if (
      rowIndex === 0 &&
      day > 20
    ) {
      return false;
    }

    if (
      rowIndex === 4 &&
      day < 20
    ) {
      return false;
    }

    return true;

  }

}