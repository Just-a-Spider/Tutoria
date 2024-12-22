import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class NotificationsGateway implements OnGatewayConnection {
  private readonly logger = new Logger(NotificationsGateway.name);

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    // Ensure the client object has the expected properties
    const userId = (client as any).userId;
    if (userId) {
      this.logger.log(`Client connected: ${userId}`);
    } else {
      this.logger.error('Client connected without userId');
    }
  }
}
