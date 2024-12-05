import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthView {
  toggleForm: boolean = false;
  loginFormGroup!: FormGroup;
  registerFormGroup!: FormGroup;
  messages: Message[] = [];
  cookieInstructions: any[] = [
    { label: 'Abre la configuración de tu navegador.' },
    { label: 'Navega a la sección de Privacidad y Seguridad.' },
    {
      label:
        'Encuentra la sección de Cookies y permite cookies para este sitio.',
    },
  ];

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.loginFormGroup = new FormGroup({
      email_username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });

    this.registerFormGroup = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9]+$'),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@udh.edu.pe$'),
      ]),
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
          localStorage.setItem('gotCourses', 'false');
          window.location.href = '';
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
    this.router.navigate(['/reset-password']);
  }

  register() {
    if (
      this.registerFormGroup.valid &&
      this.registerFormGroup.value.password ===
        this.registerFormGroup.value.confirm_password
    ) {
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
