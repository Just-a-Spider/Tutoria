import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  toggleForm: boolean = false;
  loginFormGroup!: FormGroup;
  registerFormGroup!: FormGroup;
  messages: Message[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loginFormGroup = new FormGroup({
      email_username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });

    this.registerFormGroup = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirm_password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  googleLogin() {
    this.authService.googleLogin();
  }

  toggle() {
    this.toggleForm = !this.toggleForm;
    this.messages = [];
  }

  login() {
    if (this.loginFormGroup.valid) {
      this.authService.login(this.loginFormGroup.value).subscribe({
        next: () => {
          window.location.href = '/home';
        },
        error: (error) => {
          this.messages = [
            { severity: 'error', summary: 'Error', detail: error.error.detail },
          ];
        },
      });
    }
  }

  forgotPassword() {
    // Redirect to forgot password page
    window.location.href = '/reset-password';
  }

  register() {
    if (this.registerFormGroup.valid) {
      this.authService.register(this.registerFormGroup.value).subscribe({
        next: (response) => {
          this.messages = [
            {
              severity: 'success',
              summary: 'Registro exitoso',
              detail: 'El usuario ha sido registrado exitosamente',
            },
          ];
          this.toggle();
        },
        error: (error) => {
          this.messages = [
            { severity: 'error', summary: 'Error', detail: error.error.detail },
          ];
        },
      });
    }
  }
}
