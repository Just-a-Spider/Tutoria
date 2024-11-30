import { Component, OnInit } from '@angular/core';
import { Course } from '../../../classes/course.class';
import { CoursesService } from '../../../services/courses/courses.service';
import { ThemeService } from '../../../services/misc/theme.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'course-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
})
export class CourseDetailComponent implements OnInit {
  courseData: Course = new Course();
  mode = 'student';
  gotCourse = false;
  isTutor: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private coursesService: CoursesService,
    public themeService: ThemeService
  ) {}

  ngOnInit() {
    this.themeService.profileMode$.subscribe((mode) => {
      this.mode = mode;
    });
    this.getCourse();
  }

  getCourse() {
    // Subscribe to queryParams to detect changes
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params['id']) {
        this.coursesService.getCourse(params['id']).subscribe({
          next: (course) => {
            this.courseData = course;
            this.gotCourse = true;
            // Check if the user is a tutor
            if (this.courseData.is_tutor || this.courseData.is_tryout_tutor) {
              this.isTutor = true;
            }
          },
          error: (err) => {
            console.error(err);
          },
        });
      }
    });
  }

  onEnroll() {
    this.coursesService
      .enrollCourse(this.courseData.id!.toString(), this.mode)
      .subscribe({
        next: (res) => {
          if (this.mode === 'student') {
            this.courseData.is_student = true;
            // Add the course to the student's courses
            this.courseData.students! += 1;
          } else {
            this.isTutor = true;
            // Add the course to the tutor's courses
            // Check if is a tutor or tryout tutor
            this.courseData.try_out_tutors! += 1;
            this.courseData.is_tryout_tutor = true;
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  onUnenroll() {
    this.coursesService
      .unenrollCourse(this.courseData.id!.toString(), this.mode)
      .subscribe({
        next: (res) => {
          if (this.mode === 'student') {
            this.courseData.is_student = false;
            // Remove the course from the student's courses
            this.courseData.students! -= 1;
          } else {
            this.isTutor = false;
            // Remove the course from the tutor's courses
            // Check if is a tutor or tryout tutor
            if (this.courseData.is_tryout_tutor) {
              this.courseData.try_out_tutors! -= 1;
            } else {
              this.courseData.tutors! -= 1;
            }
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
  }
}
