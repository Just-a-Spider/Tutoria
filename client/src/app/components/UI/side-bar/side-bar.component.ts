import { Component, OnInit } from '@angular/core';
import { filter, take } from 'rxjs/operators';
import { User } from '../../../classes/user.class';
import { AuthService } from '../../../services/auth.service';
import { CoursesService } from '../../../services/courses/courses.service';
import { SimpleCourse } from '../../../classes/course.class';

@Component({
  selector: 'ui-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent implements OnInit {
  user: User = new User();
  myCourses: SimpleCourse[] = [];
  allCourses: SimpleCourse[] = [];

  selectedCourseId: string = '';

  constructor(
    private authService: AuthService,
    private coursesService: CoursesService
  ) {}

  ngOnInit() {
    this.getUser();
    this.getCourses();
  }

  getUser() {
    this.authService.getUser();
    this.authService.user$
      .pipe(
        filter((user) => user !== null), // Filter out null values
        take(1) // Ensure the subscription happens only once
      )
      .subscribe({
        next: (user) => {
          this.user = user;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  getCourses() {
    this.coursesService.getMyCourses().subscribe({
      next: (data: any) => {
        this.myCourses = data.results;
      },
      error: (error) => {
        console.error(error);
      },
    });
    this.coursesService.getAllCourses().subscribe({
      next: (data: any) => {
        this.allCourses = data;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  seeCourse(courseId: string) {
    this.coursesService.getCourse(courseId).subscribe({
      next: (data: any) => {
        this.coursesService.setCurrentCourse(data);
        // If the current route is not '/course', navigate to '/course'
        if (window.location.pathname !== '/course') {
          window.location.pathname = '/course';
        }
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  logout() {
    this.authService.logout();
  }
}
