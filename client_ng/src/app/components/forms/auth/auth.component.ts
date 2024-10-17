import { Component } from '@angular/core';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
  imports: [FormsModule, ToggleButtonModule],
})
export class AuthComponent {
  loginModel = {
    email_username: '',
    password: '',
  };

  constructor(private authService: AuthService) {}

  login() {
    this.authService.login(this.loginModel).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
