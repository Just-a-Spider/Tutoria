import { Component, OnInit } from '@angular/core';
import { SimpleCourse } from '../../../classes/course.class';
import { CoursesService } from '../../../services/courses/courses.service';
import { ThemeService } from '../../../services/misc/theme.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'ui-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent implements OnInit {
  myCourses: SimpleCourse[] = [];
  allCourses: SimpleCourse[] = [];
  mode: string = 'student';
  isOnAuth = false;

  selectedCourseId: string = '';

  constructor(
    private router: Router,
    private coursesService: CoursesService,
    private themeService: ThemeService
  ) {
    if (
      window.location.pathname.includes('auth') ||
      window.location.pathname.includes('admin')
    ) {
      this.isOnAuth = true;
    }
  }

  ngOnInit() {
    this.themeService.profileMode$.subscribe((mode) => {
      this.mode = mode;
    });
    if (!this.isOnAuth && localStorage.getItem('gotCourses') === 'false') {
      this.getCourses();
      localStorage.setItem('gotCourses', 'true');
    } else {
      this.myCourses = JSON.parse(localStorage.getItem('myCourses') || '[]');
      this.allCourses = JSON.parse(localStorage.getItem('allCourses') || '[]');
    }
  }

  refresh() {
    this.getCourses();
  }

  getCourses() {
    this.coursesService.getMyCourses().subscribe({
      next: (data: any) => {
        this.myCourses = data;
        localStorage.setItem('myCourses', JSON.stringify(this.myCourses));
      },
      error: (error) => {
        console.error(error);
      },
    });
    this.coursesService.getAllCourses().subscribe({
      next: (data: any) => {
        this.allCourses = data;
        localStorage.setItem('allCourses', JSON.stringify(this.allCourses));
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
