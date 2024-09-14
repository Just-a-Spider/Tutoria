import { Component, Input } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class NotificationsComponent {
  @Input() count: number = 0;

  toggleNotifications() {
    console.log('Notifications toggled');
    // Add your logic here to show/hide notifications
  }
  public notifications: any[] = [];

  constructor(private notificationService: NotificationService) {
    this.notificationService.getNotifications().subscribe((data) => {
      console.log('Notifications:', data);
    });
  }

  public clearNotifications() {
    this.notifications = [];
  }
}
