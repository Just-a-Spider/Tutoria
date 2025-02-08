import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { DynamicWebSocketAdapter } from './adapters/dynamic-websocket.adapter';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set the application to handle cookies
  app.use(cookieParser());

  // Create and connect the custom WebSocket adapter
  const wsAdapter = new DynamicWebSocketAdapter(app);
  wsAdapter.setHttpServer(app.getHttpServer());
  await wsAdapter.connectToRedis(process.env.REDIS_URL);
  app.useWebSocketAdapter(wsAdapter);

  // Rest of your existing configuration...
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'content-type',
      'authorization',
      'refresh',
      'auth-x-mobile',
      'x-api-key',
      'x-requested-with',
      'accept',
      'origin',
      'user-agent',
      'dnt',
      'cache-control',
      'x-csrftoken',
      'x-frame-options',
      'Sec-WebSocket-Key',
      'Sec-WebSocket-Version',
      'Sec-WebSocket-Extensions',
      'Connection',
      'Upgrade',
    ],
    credentials: true,
  });

  const port = process.env.PORT || 8000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
