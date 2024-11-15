import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../classes/user.class';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private googleApiUrl = environment.apiUrl + 'oauth/login/google-oauth2/';
  private apiUrl = environment.apiUrl + 'auth/';
  private userSubject: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);
  user$: Observable<User | null> = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  register(data: any) {
    return this.http.post(`${this.apiUrl}register/`, data, {
      withCredentials: true,
    });
  }

  login(data: any) {
    return this.http.post(`${this.apiUrl}login/`, data, {
      withCredentials: true,
    });
  }

  googleLogin() {
    window.location.href = this.googleApiUrl;
  }

  logout() {
    this.http
      .get(`${this.apiUrl}logout/`, {
        withCredentials: true,
      })
      .subscribe({
        next: (response) => {
          window.location.href = '/auth';
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  getUser() {
    this.http
      .get(`${this.apiUrl}me/`, {
        withCredentials: true,
      })
      .subscribe({
        next: (response: any) => {
          this.userSubject.next(response);
        },
        error: (error) => {
          window.location.href = '/auth';
        },
      });
  }
}
