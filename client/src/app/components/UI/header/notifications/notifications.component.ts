import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import {
  FullNotification,
  PopUpNotification,
} from '../../../../classes/notifications.class';
import { ThemeService } from '../../../../services/misc/theme.service';
import { NotificationsService } from '../../../../services/notifications.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'header-notis',
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
  providers: [MessageService],
})
export class NotificationsComponent implements OnInit {
  notifications: FullNotification[] = [];
  oldNotifications: FullNotification[] = [];
  mode = 'student';
  items: MenuItem[] = [];
  oldItems: MenuItem[] = [];

  constructor(
    public themeService: ThemeService,
    private router: Router,
    private notiService: NotificationsService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    // Check if the user is on the auth page
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects;
        if (url.includes('/auth') || url.includes('/reset-password')) {
          this.notiService.close();
        } else {
          this.themeService.profileMode$.subscribe((mode) => {
            this.mode = mode;
            this.loadNotificationsFromSession();
            this.updatNewNotificationsItems();
            this.updateOldNotificationsItems();
          });
          this.notiService.wsNotification$.subscribe((noti) => {
            if (noti.type !== '') {
              this.showToast(noti);
              this.getNotifications();
              this.updatNewNotificationsItems();
              this.updateOldNotificationsItems();
            }
          });
          this.getNotifications();
          this.updatNewNotificationsItems();
          this.updateOldNotificationsItems();
        }
      });
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

  // MENU ITEMS
  updatNewNotificationsItems() {
    this.items = [
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
        command: () => this.clearSeen(),
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
