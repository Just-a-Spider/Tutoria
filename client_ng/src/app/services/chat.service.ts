import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket: WebSocket | undefined;
  private messageSubject: Subject<any> = new Subject<any>();

  constructor() {
    this.connect();
  }

  private connect() {
    this.socket = new WebSocket('ws://127.0.0.1:8000/ws/chat/');

    this.socket.onopen = (event) => {
      console.log('WebSocket open');
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.messageSubject.next(data);
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket connection closed');
    };

    this.socket.onerror = (event) => {
      console.error('WebSocket error:', event);
    };
  }

  public sendMessage(type: string, data: string) {
    this.socket?.send(JSON.stringify({ type, data }));
  }

  public getMessages(): Observable<any> {
    return this.messageSubject.asObservable();
  }
}
