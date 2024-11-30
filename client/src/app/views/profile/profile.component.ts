import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { User } from '../../classes/user.class';
import { StudentProfile, TutorProfile } from '../../classes/profile.class';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  providers: [MessageService],
})
export class ProfileView implements OnInit {
  newPassword: string = '';
  confirmPassword: string = '';
  user: User = new User();
  studentProfile: StudentProfile = new StudentProfile();
  tutorProfile: TutorProfile = new TutorProfile();
  ready: boolean = false;

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private router: Router,
    private messagesService: MessageService
  ) {}

  ngOnInit() {
    this.user = this.authService.getUserValue();
    this.profileService.getStudentProfile().subscribe({
      next: (response) => {
        this.studentProfile = response;
      },
      error: (error) => {
        this.messagesService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el perfil del estudiante.',
        });
      },
    });
    this.profileService.getTutorProfile().subscribe({
      next: (response) => {
        console.log(response);
        this.tutorProfile = response;
      },
      error: (error) => {
        this.messagesService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el perfil del tutor.',
        });
      },
    });
    this.ready = true;
  }

  goBack() {
    // Redirect to the previous page
    this.router.navigate(['/']);
  }

  changePassword() {
    this.messagesService.add({
      severity: 'info',
      summary: 'No implementado',
      detail: 'Esta función no ha sido implementada aún.',
    });
  }
}
