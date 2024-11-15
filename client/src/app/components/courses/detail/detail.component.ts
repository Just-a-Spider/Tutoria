import { Component, Input, OnInit } from '@angular/core';
import { CoursesService } from '../../../services/courses/courses.service';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../../../classes/course.class';

@Component({
  selector: 'course-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
})
export class CourseDetailComponent {
  courseData: Course = new Course();

  constructor(private coursesService: CoursesService) {
    this.getCourse();
  }

  getCourse() {
    this.coursesService.currentCourse$.subscribe((course) => {
      this.courseData = course;
    });
  }
}
