import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { environment } from '../../../environments/environment';
import { StudentProfile, TutorProfile } from '../../classes/profile.class';
import { User } from '../../classes/user.class';
import { AuthService } from '../../services/auth.service';
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
  mobile = false;
  mainClass =
    'flex flex-row gap-8 w-screen justify-content-center align-items-start p-4 mt-8';
  mainCardClass = 'profile-card';

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private router: Router,
    private messagesService: MessageService
  ) {}

  ngOnInit() {
    this.mobile = window.innerWidth <= 768;
    if (this.mobile) {
      this.mainClass =
        'flex flex-column gap-4 w-full justify-content-center p-4';
      this.mainCardClass = 'profile-card-mobile';
    }
    this.user = this.authService.getUserValue();
    this.getProfiles();
  }

  getProfiles() {
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

  uploadPfp(event: any, fileUpload: FileUpload, mode: string) {
    const file = event.files[0];
    this.profileService.uploadProfilePicture(file, mode).subscribe({
      next: (response) => {
        if (environment.production) {
          this.messagesService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'La imagen de perfil ha sido actualizada.',
          });
          // Refetch the profile picture
          this.getProfiles();
        } else {
          if (mode === 'student') {
            this.studentProfile.profile_picture = `${environment.hostUrl}${response.message}`;
          } else {
            this.tutorProfile.profile_picture = `${environment.hostUrl}${response.message}`;
          }
          this.messagesService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'La imagen de perfil ha sido actualizada.',
          });
        }
      },
      error: (error) => {
        this.messagesService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar la imagen de perfil.',
        });
      },
    });
    fileUpload.clear();
  }
}
