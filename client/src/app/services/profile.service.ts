import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StudentProfile, TutorProfile } from '../classes/profile.class';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiUrl = environment.apiUrl + 'profiles/';

  constructor(private http: HttpClient) {}

  // STUDENT PROFILE
  getStudentProfile(): Observable<StudentProfile> {
    return this.http.get<StudentProfile>(`${this.apiUrl}student/`, {
      withCredentials: true,
    });
  }

  // TUTOR PROFILE
  getTutorProfile(): Observable<TutorProfile> {
    return this.http.get<TutorProfile>(`${this.apiUrl}tutor/`, {
      withCredentials: true,
    });
  }
}
