import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private socket: WebSocket | undefined;
  private notificationSubject: Subject<any> = new Subject<any>();

  constructor(private authService: AuthService) {
    this.connect();
  }

  private connect() {
    const userId = this.authService.getUserId();
    const wsUrl = `ws://127.0.0.1:8000/ws/notifications/${userId}/`;
    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = (event) => {
      console.log('WebSocket connection opened');
    };

    this.socket.onmessage = (event) => {
      let message = JSON.parse(event.data);
      message = message.data
      this.notificationSubject.next(message);
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket connection closed');
    };

    this.socket.onerror = (event) => {
      console.error('WebSocket error:', event);
    };
  }

  getNotifications(): Observable<any> {
    this.connect();
    return this.notificationSubject.asObservable();
  }
}
