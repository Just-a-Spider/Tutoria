import { Injectable } from '@nestjs/common';
import { DynamicWebSocketAdapter } from '../../adapters/dynamic-websocket.adapter';

@Injectable()
export class NotificationsService {
  constructor(private readonly wsAdapter: DynamicWebSocketAdapter) {}

  async sendNotificationToUser(userId: string, message: any) {
    await this.wsAdapter.sendToUser(userId, message);
  }
}
