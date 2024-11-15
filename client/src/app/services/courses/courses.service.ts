import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  private apiUrl = environment.apiUrl + 'courses/';

  constructor(private http: HttpClient) {}

  getMyCourses() {
    return this.http.get(this.apiUrl, { withCredentials: true });
  }

  getAllCourses() {
    return this.http.get(this.apiUrl + 'all-courses/', {
      withCredentials: true,
    });
  }
}
