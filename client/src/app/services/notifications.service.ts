import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  FullNotification,
  PopUpNotification,
} from '../classes/notifications.class';
import { User } from '../classes/user.class';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private socketUrl = `${environment.socketUrl}notifications/`;
  private apiUrl = `${environment.apiUrl}notifications/`;
  private socket: WebSocket | undefined;

  private notificationSubject: BehaviorSubject<PopUpNotification> =
    new BehaviorSubject<PopUpNotification>(
      new PopUpNotification({ type: '', data: '' })
    );
  wsNotification$ = this.notificationSubject.asObservable();

  private licenseIdSubject = new BehaviorSubject<string>('');
  licenseId$ = this.licenseIdSubject.asObservable();
  goToPost(licenseId: string) {
    this.licenseIdSubject.next(licenseId);
  }

  constructor(private authService: AuthService, private http: HttpClient) {
    this.connect();
  }

  private async connect() {
    this.authService.user$
      .pipe(filter((user) => user.id !== undefined && user.id !== 0))
      .subscribe({
        next: (user: User) => {
          const userId = user.id;
          const wsUrl = `${this.socketUrl}`;

          this.socket = new WebSocket(wsUrl);

          this.socket.onopen = (event) => {};

          this.socket.onmessage = (event) => {
            let message = JSON.parse(event.data);
            this.notificationSubject.next(message);
          };

          this.socket.onerror = (event) => {
            console.error('WebSocket error:', event);
          };
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  close() {
    if (this.socket) {
      this.socket.close();
    }
  }

  private getNotifications(mode: string): Observable<FullNotification[]> {
    return this.http.get<FullNotification[]>(`${this.apiUrl}${mode}/`);
  }

  getStudentNotifications(): Observable<FullNotification[]> {
    return this.getNotifications('student');
  }

  getTutorNotifications(): Observable<FullNotification[]> {
    return this.getNotifications('tutor');
  }

  markSeen(notificationId: string, mode: string = 'student'): Observable<any> {
    return this.http.get(`${this.apiUrl}${mode}/${notificationId}/`);
  }
  clearSeen(mode: string = 'student') {
    return this.http.delete(`${this.apiUrl}${mode}/clear/`);
  }
}
