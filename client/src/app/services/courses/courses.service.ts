import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Course } from '../../classes/course.class';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  private apiUrl = environment.apiUrl + 'courses/';

  private currentCourseSubject: BehaviorSubject<Course>;
  currentCourse$: Observable<Course>;

  constructor(private http: HttpClient) {
    const savedCourse = localStorage.getItem('currentCourse');
    this.currentCourseSubject = new BehaviorSubject<Course>(
      savedCourse ? JSON.parse(savedCourse) : new Course()
    );
    this.currentCourse$ = this.currentCourseSubject.asObservable();
  }

  getMyCourses() {
    return this.http.get(this.apiUrl, { withCredentials: true });
  }

  getAllCourses() {
    return this.http.get(this.apiUrl + 'all-courses/', {
      withCredentials: true,
    });
  }

  getCourse(id: string): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}${id}/`, {
      withCredentials: true,
    });
  }

  setCurrentCourse(course: Course) {
    this.currentCourseSubject.next(course);
    localStorage.setItem('currentCourse', JSON.stringify(course));
  }
}
