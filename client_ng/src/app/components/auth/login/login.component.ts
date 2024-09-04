import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { LoginProps } from '../../../classes/user.class';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginData: LoginProps = {
    email_username: '',
    password: ''
  }

  constructor(private authService: AuthService) { }

  login() {
    this.authService.login(this.loginData).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

}
