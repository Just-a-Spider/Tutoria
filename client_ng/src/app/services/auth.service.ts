import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginProps, RegisterProps, User } from '../classes/user.class';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://127.0.0.1:8000/auth/';

  constructor(private authHttp: HttpClient) {}

  login(loginData: LoginProps) {
    return this.authHttp.post<User>(this.baseUrl + 'login/', loginData);
  }
}
