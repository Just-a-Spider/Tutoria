import { Component } from '@angular/core';
import { NotificatinonService } from '../../../services/notificatinon.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class NotificationsComponent {
  public notifications: any[] = [];

  constructor(private notificationService: NotificatinonService) {
    this.notificationService.getNotifications().subscribe((data) => {
      console.log('Notifications:', data);
    });
  }

  public clearNotifications() {
    this.notifications = [];
  }
}
