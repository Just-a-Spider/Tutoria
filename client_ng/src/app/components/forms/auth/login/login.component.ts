import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
  ) {
    this.loginForm = this.fb.group({
      email_username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next(response) {
          console.log(response);
        },
      });
      console.log(this.loginForm.value);
    }
  }
  // loginData: LoginProps = {
  //   email_username: '',
  //   password: '',
  // };

  // constructor(
  //   private authService: AuthService,
  //   private notificationService: NotificationService
  // ) {}

  // login() {
  //   this.authService.login(this.loginData).subscribe({
  //     next(response) {
  //       console.log(response);
  //     },
  //   });
  //   this.notificationService.getNotifications().subscribe((data) => {
  //     console.log('Notifications:', data);
  //   });
  //   // Reload the Page to make the handshake with the server
  //   // window.location.reload();
  // }
}
