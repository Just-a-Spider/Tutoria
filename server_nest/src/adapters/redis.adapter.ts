// /* eslint-disable @typescript-eslint/no-unsafe-function-type */
// import { INestApplicationContext, WebSocketAdapter } from '@nestjs/common';
// import { MessageMappingProperties } from '@nestjs/websockets';
// import { createClient } from 'redis';
// import { EMPTY, Observable, fromEvent } from 'rxjs';
// import { filter, mergeMap } from 'rxjs/operators';
// import * as WebSocket from 'ws';

// export class CustomWebSocket extends WebSocket {
//   userId: string;
// }

// export class RedisWsAdapter implements WebSocketAdapter {
//   private pubClient;
//   private subClient;

//   constructor(private app: INestApplicationContext) {}

//   async connectToRedis(url: string): Promise<void> {
//     this.pubClient = createClient({ url });
//     this.subClient = this.pubClient.duplicate();

//     await Promise.all([this.pubClient.connect(), this.subClient.connect()]);
//     console.log('Connected to Redis');
//   }

//   create(port: number, options?: any): WebSocket.Server {
//     const server = new WebSocket.Server({ port, ...options });
//     console.log(`WebSocket server created on port ${port}`);
//     server.on('connection', (socket: CustomWebSocket, request) => {
//       const url = new URL(request.url, `http://${request.headers.host}`);
//       const userId = url.pathname.split('/').pop();
//       socket.userId = userId;
//       console.log(`Client connected with userId: ${userId}`);
//     });
//     return server;
//   }

//   bindClientConnect(server, callback: Function) {
//     server.on('connection', callback);
//   }

//   bindMessageHandlers(
//     client: WebSocket,
//     handlers: MessageMappingProperties[],
//     process: (data: any) => Observable<any>,
//   ) {
//     fromEvent(client, 'message')
//       .pipe(
//         mergeMap((data) => this.bindMessageHandler(data, handlers, process)),
//         filter((result) => result),
//       )
//       .subscribe((response) => client.send(JSON.stringify(response)));
//   }

//   bindMessageHandler(
//     buffer,
//     handlers: MessageMappingProperties[],
//     process: (data: any) => Observable<any>,
//   ): Observable<any> {
//     const message = JSON.parse(buffer.data);
//     const messageHandler = handlers.find(
//       (handler) => handler.message === message.event,
//     );
//     if (!messageHandler) {
//       return EMPTY;
//     }
//     return process(messageHandler.callback(message.data));
//   }

//   close(server: WebSocket.Server) {
//     server.close();
//   }
// }
