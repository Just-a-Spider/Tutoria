import { Component, OnInit } from '@angular/core';
import { SimpleCourse } from '../../../classes/course.class';
import { CoursesService } from '../../../services/courses/courses.service';
import { ThemeService } from '../../../services/misc/theme.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ui-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent implements OnInit {
  myCourses: SimpleCourse[] = [];
  allCourses: SimpleCourse[] = [];
  mode: string = 'student';

  selectedCourseId: string = '';

  constructor(
    private router: Router,
    private coursesService: CoursesService,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.themeService.profileMode$.subscribe((mode) => {
      this.mode = mode;
    });
    this.getCourses();
  }

  refresh() {
    this.getCourses();
  }

  getCourses() {
    this.coursesService.getMyCourses().subscribe({
      next: (data: any) => {
        this.myCourses = data;
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
    this.router.navigate(['/course'], { queryParams: { id: courseId } });
  }
}
