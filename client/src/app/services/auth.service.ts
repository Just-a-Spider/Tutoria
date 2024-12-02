import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../classes/user.class';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private googleApiUrl = environment.apiUrl + 'oauth/login/google-oauth2/';
  private apiUrl = environment.apiUrl + 'auth/';
  private userSubject: BehaviorSubject<User>;
  user$: Observable<User>;

  setUser(user: User) {
    this.userSubject.next(user);
  }

  getUserValue(): User {
    return this.userSubject.value;
  }

  constructor(private http: HttpClient, private router: Router) {
    this.userSubject = new BehaviorSubject<User>(new User());
    this.user$ = this.userSubject.asObservable();
  }

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

  getUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}me/`, {
      withCredentials: true,
    });
  }

  logout() {
    this.http
      .get(`${this.apiUrl}logout/`, {
        withCredentials: true,
      })
      .subscribe({
        next: (response) => {
          this.userSubject.next(new User()); // Clear the user state
          this.router.navigate(['/auth']);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
}
