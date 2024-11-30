import { User } from './user.class';

export class PopUpNotification {
  type: string;
  data: string;

  constructor(notification: any) {
    this.type = notification.type;
    this.data = notification.data;
  }
}

export class FullNotification {
  id: string;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
  read: boolean;
  instance_id: string;
  user: User | number;

  constructor(notification: any) {
    this.id = notification.id;
    this.title = notification.title;
    this.body = notification.body;
    this.created_at = notification.created_at;
    this.updated_at = notification.updated_at;
    this.read = notification.read;
    this.instance_id = notification.instance_id;
    this.user = notification.user;
  }
}
