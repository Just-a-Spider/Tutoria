/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { WsAuth } from '@/middleware/ws-auth.middleware';
import {
  INestApplicationContext,
  Logger,
  WebSocketAdapter,
} from '@nestjs/common';
import { MessageMappingProperties } from '@nestjs/websockets';
import * as http from 'http';
import { Redis } from 'ioredis';
import { createClient } from 'redis';
import { Observable, Subject, fromEvent, merge } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as WebSocket from 'ws';

export class DynamicWebSocketAdapter implements WebSocketAdapter {
  private readonly logger = new Logger(DynamicWebSocketAdapter.name);
  private readonly wsAuth = new WsAuth();
  private readonly redisClient: Redis;
  private socketServer: WebSocket.Server;
  private upgradedSockets: WeakMap<any, boolean> = new WeakMap();
  private httpServer: http.Server;
  public connections: Map<number, WebSocket[]> = new Map();

  constructor(
    private app: INestApplicationContext,
    // private httpServer: http.Server,
  ) {
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD || undefined,
    });

    this.socketServer = new WebSocket.Server({ noServer: true });
  }

  setHttpServer(httpServer: http.Server) {
    this.httpServer = httpServer;

    // Handle upgrade requests
    this.httpServer.on('upgrade', (request, socket, head) => {
      this.handleUpgrade(request, socket, head);
    });
  }

  /**
   * Connects to a Redis server using the provided URL from environment variables or defaults to 'redis://localhost:6379'.
   * It creates a publisher and a subscriber client, connects both, and sets up an error handler for the Redis client.
   * Logs a message upon successful connection.
   *
   * @returns {Promise<void>} A promise that resolves when both clients are connected.
   * @throws Will log an error message if there is an issue connecting to Redis.
   */
  async connectToRedis(url: string): Promise<void> {
    const pubClient = createClient({
      url: url,
    });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);
    this.redisClient.on('error', (error) => {
      this.logger.error('Redis error:', error);
    });
    this.logger.log('Connected to Redis');
  }

  /**
   * Handles the upgrade of an HTTP request to a WebSocket connection.
   *
   * This method checks if the incoming request is for a dynamic WebSocket endpoint,
   * extracts the user ID from the URL, performs authentication, and sets up the
   * WebSocket connection and message handler.
   *
   * @param request - The incoming HTTP request.
   * @param socket - The network socket between the server and client.
   * @param head - The first packet of the upgraded stream.
   *
   * @returns A promise that resolves when the upgrade handling is complete.
   *
   * @throws Will destroy the socket and log an error if the WebSocket endpoint is invalid
   *         or if the user ID is not a valid number.
   */
  private async handleUpgrade(
    request: http.IncomingMessage,
    socket: any,
    head: Buffer,
  ) {
    // Check if the request is for the WebSocket endpoint
    if (!request.url.startsWith('/ws/notifications/')) {
      socket.destroy();
      this.logger.error('Invalid WebSocket endpoint');
      return;
    }

    // Check if the socket has already been upgraded
    if (this.upgradedSockets.has(socket)) {
      this.logger.error('Socket already upgraded');
      return;
    } else {
      this.upgradedSockets.set(socket, true);
    }

    const { success, message, user } = await this.wsAuth.authenticateUser(
      request,
      this.app,
    );

    if (!success) {
      socket.destroy();
      this.logger.error(`Websocket authentication failed: ${message}`);
      return;
    }

    this.socketServer.handleUpgrade(request, socket, head, (ws) => {
      (ws as any).userId = user.sub;
      this.socketServer.emit('connection', ws, request);
    });
  }

  create(port: number, options?: any): WebSocket.Server {
    this.socketServer = new WebSocket.Server({ noServer: true });
    this.logger.log('WebSocket server created');
    this.httpServer.on('upgrade', (request, socket, head) => {
      // Ensure handleUpgrade is only called once per request
      if (!this.upgradedSockets.has(socket)) {
        this.handleUpgrade(request, socket, head);
      }
    });
    return this.socketServer;
  }

  bindClientConnect(server: any, callback: Function) {
    server.on('connection', callback);
  }

  // Bind WebSocket to the server
  bindMessageHandlers(
    socket: WebSocket,
    handlers: MessageMappingProperties[],
  ): Observable<any> {
    // Create a subject to handle messages
    const messageSubject = new Subject();

    // Handle incoming messages
    socket.on('message', (data: WebSocket.Data) => {
      const message = data.toString();
      try {
        const parsedMessage = JSON.parse(message);
        messageSubject.next(parsedMessage);
      } catch (error) {
        this.logger.error('Message parsing error:', error);
      }
    });

    // Merge different message types
    const messageObservable = merge(
      fromEvent(socket, 'message').pipe(
        map((data: WebSocket.Data) => ({
          event: 'message',
          data: data.toString(),
        })),
      ),
      fromEvent(socket, 'close').pipe(map(() => ({ event: 'close' }))),
    );

    return messageObservable.pipe(
      filter((event: any) => {
        if (event.event === 'close') {
          return false;
        }
        return true;
      }),
      map((event) => {
        try {
          return JSON.parse(event.data);
        } catch {
          return event.data;
        }
      }),
    );
  }

  // Create server connection
  async createMessageHandler(socket: WebSocket, userId: number): Promise<void> {
    // Store connection
    if (!this.connections.has(userId)) {
      await this.connections.set(userId, []);
    }
    this.connections.get(userId).push(socket);

    await this.redisClient.sadd(`ws:connections:${userId}`, socket.url);

    // Handle disconnection
    socket.on('close', async () => {
      // Remove the closed socket from the connections array
      const userConnections = this.connections.get(userId) || [];
      const updatedConnections = userConnections.filter((s) => s !== socket);
      this.connections.set(userId, updatedConnections);

      // Log the disconnection event
      this.logger.log(`Socket for user ${userId} disconnected.`);

      // If no more sockets remain for this user, remove the Redis entries
      if (updatedConnections.length === 0) {
        await this.redisClient.del(`ws:connections:${userId}`);
        await this.redisClient.del(`user:${userId}:notifications`);
        this.logger.log(
          `All sockets for user ${userId} are closed. Redis keys removed.`,
        );
      }
    });
  }

  // Close connection
  close(socket: WebSocket): void {
    socket.close();
  }
  async sendToUser(userId: number, message: any): Promise<void> {
    const userConnections = this.connections.get(userId);
    if (!userConnections || userConnections.length === 0) {
      console.error(`No connections found for user: ${userId}`);
      return;
    }
    const socket = userConnections[0] as WebSocket;
    if (socket) {
      socket.send(JSON.stringify(message));
    } else {
      console.error(`Socket not found for user: ${userId}`);
    }
    // Optional: store message in Redis
    await this.redisClient.rpush(
      `user:${userId}:notifications`,
      JSON.stringify(message),
    );
  }
}
