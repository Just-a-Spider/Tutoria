import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { filter } from 'rxjs';
import {
  FullNotification,
  PopUpNotification,
} from '../../../../classes/notifications.class';
import { ThemeService } from '../../../../services/misc/theme.service';
import { NotificationsService } from '../../../../services/notifications.service';

@Component({
  selector: 'header-notis',
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
  providers: [MessageService],
})
export class NotificationsComponent implements OnInit {
  @Input() mobile = false;
  notifications: FullNotification[] = [];
  oldNotifications: FullNotification[] = [];
  mode = 'student';
  items: MenuItem[] = [];
  oldItems: MenuItem[] = [];
  mainClass = 'flex flex-row gap-1';

  constructor(
    public themeService: ThemeService,
    private router: Router,
    private notiService: NotificationsService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.mainClass = this.mobile
      ? 'flex flex-column gap-1'
      : 'flex flex-row gap-1';
    // Check if the user is on the auth page
    this.notiService.wsNotification$.subscribe((noti) => {
      if (noti.type !== '') {
        this.showToast(noti);
        this.getNotifications();
        this.updatNewNotificationsItems();
        this.updateOldNotificationsItems();
      }
    });
    if (
      window.location.pathname.includes('auth') ||
      window.location.pathname.includes('admin') ||
      localStorage.getItem('gotNotis') === 'true'
    ) {
      return;
    } else {
      localStorage.setItem('gotNotis', 'true');
      this.themeService.profileMode$.subscribe((mode) => {
        this.mode = mode;
        this.loadNotificationsFromSession();
        this.updatNewNotificationsItems();
        this.updateOldNotificationsItems();
      });
      this.getNotifications();
      this.updatNewNotificationsItems();
      this.updateOldNotificationsItems();
    }
  }
  ngOnDestroy() {
    this.notiService.close();
  }

  // NOTIFICATIONS' METHODS
  // Manage the change of notification by mode locally
  loadNotificationsFromSession() {
    const notisKey = this.mode === 'tutor' ? 'tutorNotis' : 'studentNotis';
    const seenNotisKey =
      this.mode === 'tutor' ? 'seenTutorNotis' : 'seenStudentNotis';
    const notisString = sessionStorage.getItem(notisKey);
    const seenNotisString = sessionStorage.getItem(seenNotisKey);
    const notis = notisString ? JSON.parse(notisString) : [];
    const seenNotis = seenNotisString ? JSON.parse(seenNotisString) : [];
    this.notifications = notis.filter((noti: FullNotification) => !noti.read);
    this.oldNotifications = notis
      .filter((noti: FullNotification) => noti.read)
      .concat(seenNotis);
  }
  // Get notifications from the server
  getNotifications() {
    this.notiService.getStudentNotifications().subscribe({
      next: (notifications) => {
        this.storeNotifications(notifications, 'student');
      },
      error: (error: any) => {
        console.error(error);
      },
    });
    this.notiService.getTutorNotifications().subscribe({
      next: (notifications) => {
        this.storeNotifications(notifications, 'tutor');
      },
      error: (error: any) => {
        console.error(error);
      },
    });
    this.updatNewNotificationsItems();
    this.updateOldNotificationsItems();
  }
  // Store notifications in the session storage
  storeNotifications(notifications: FullNotification[], mode: string) {
    const seenNotis = notifications.filter((noti) => noti.read);
    const notSeenNotis = notifications.filter((noti) => !noti.read);
    const notisKey = mode === 'tutor' ? 'tutorNotis' : 'studentNotis';
    const seenNotisKey =
      this.mode === 'tutor' ? 'seenTutorNotis' : 'seenStudentNotis';
    sessionStorage.setItem(notisKey, JSON.stringify(notSeenNotis));
    sessionStorage.setItem(seenNotisKey, JSON.stringify(seenNotis));
  }
  // Go to the post related to the notification
  goToPost(postId: string) {
    this.notiService.goToPost(postId);
  }
  // Update the seen notifications locally but send the request to the server
  markSeen(notificationId: string) {
    this.notiService.markSeen(notificationId, this.mode).subscribe({
      next: () => {
        this.notifications = this.notifications.map((noti) => {
          if (noti.id === notificationId) {
            noti.read = true;
          }
          return noti;
        });
        this.updatNewNotificationsItems();
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }
  // Clear the seen notifications from the server and the session storage
  clearSeen(old: boolean = true) {
    this.notiService.clearSeen(this.mode).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Notificaciones',
          detail: 'Notificaciones eliminadas',
        });
        sessionStorage.removeItem(
          this.mode === 'tutor' ? 'seenTutorNotis' : 'seenStudentNotis'
        );
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }

  markAllAsSeen() {
    // Clear the student or tutor notifications based on the mode
    if (this.mode === 'student') {
      sessionStorage.removeItem('studentNotis');
    } else {
      sessionStorage.removeItem('tutorNotis');
    }
    this.notifications = [];
    this.updatNewNotificationsItems();
    this.updateOldNotificationsItems();
  }

  // MENU ITEMS
  updatNewNotificationsItems() {
    this.items = [
      // Set all notifications as seen
      {
        label: 'Marcar todas como leídas',
        icon: 'pi pi-check',
        command: () => this.markAllAsSeen(),
      },
      ...this.notifications.map((noti) => ({
        label: noti.title,
        icon: 'pi pi-bell',
        command: () => this.goToPost(noti.instance_id),
      })),
    ];
  }

  updateOldNotificationsItems() {
    this.oldItems = [
      // Clear all seen notifications
      {
        label: 'Limpiar notificaciones',
        icon: 'pi pi-trash',
        // command: () => this.clearSeen(),
      },
      ...this.oldNotifications.map((noti) => ({
        label: noti.title,
        icon: 'pi pi-bell',
        command: () => this.goToPost(noti.instance_id),
      })),
    ];
  }

  // TOAST
  showToast(noti: PopUpNotification) {
    this.messageService.add({
      severity: 'info',
      summary: 'Notificaciones',
      detail: noti.data,
    });
  }
}
