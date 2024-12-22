import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Course } from '../../classes/course.class';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  private apiUrl = environment.apiUrl + 'courses/';

  constructor(private http: HttpClient) {}

  getMyCourses() {
    return this.http.get(this.apiUrl);
  }

  getAllCourses() {
    return this.http.get(this.apiUrl + 'all-courses/');
  }

  getCourse(id: string): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}${id}/`);
  }

  enrollCourse(id: string, mode: string) {
    if (mode === 'student') {
      return this.http.post(`${this.apiUrl}${id}/students/`, {});
    }
    return this.http.post(`${this.apiUrl}${id}/tutors/`, {});
  }

  unenrollCourse(id: string, mode: string) {
    if (mode === 'student') {
      return this.http.delete(`${this.apiUrl}${id}/students/`);
    }
    return this.http.delete(`${this.apiUrl}${id}/tutors/`);
  }
}
