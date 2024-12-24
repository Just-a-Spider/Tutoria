import { DynamicWebSocketAdapter } from '@/adapters/dynamic-websocket.adapter';
import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import * as Websocket from 'ws';

@WebSocketGateway()
export class NotificationsGateway implements OnGatewayConnection {
  private readonly logger = new Logger(NotificationsGateway.name);

  constructor(private readonly wsAdapter: DynamicWebSocketAdapter) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Websocket) {
    // Ensure the client object has the expected properties
    const userId = (client as any).userId;
    if (userId) {
      this.logger.log(`Client connected: ${userId}`);
      await this.wsAdapter.createMessageHandler(client, userId);
    } else {
      this.logger.error('Client connected without userId');
    }
  }

  async sendNotificationToUsers(users: number[], message: any) {
    users.forEach((userId) => {
      this.wsAdapter.sendToUser(userId, message);
    });
  }
}
