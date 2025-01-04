import { PaginatorModule } from '@/lib/paginator/paginator.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtModule } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './modules/auth/auth.module';
import { CoursesModule } from './modules/courses/courses.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { UserModule } from './modules/user/user.module';
import { TokenService } from './utils/token.service';
import { WebsocketModule } from './utils/websocket.module';

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Paginator
    PaginatorModule.forRoot({
      pageSize: 5,
    }),

    // Serve Static Files
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),

    // JWT
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),

    // Event Emitter
    EventEmitterModule.forRoot({
      // set this to `true` to use wildcards
      wildcard: false,
      // the delimiter used to segment namespaces
      delimiter: '.',
      // set this to `true` if you want to emit the newListener event
      newListener: false,
      // set this to `true` if you want to emit the removeListener event
      removeListener: false,
      // the maximum amount of listeners that can be assigned to an event
      maxListeners: 10,
      // show event name in memory leak message when more than maximum amount of listeners is assigned
      verboseMemoryLeak: false,
      // disable throwing uncaughtException if an error event is emitted and it has no listeners
      ignoreErrors: false,
    }),

    // BullMQ (Redis)
    BullModule.forRoot({
      connection: {
        url: process.env.REDIS_URL,
      },
    }),

    // Database
    MikroOrmModule.forRoot({
      driver: PostgreSqlDriver,
      dbName: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT),
      host: process.env.DB_HOST,
      migrations: {
        tableName: 'mikro_orm_migrations',
      },
      baseDir: process.cwd(),
      entities: ['dist/modules/**/*.entity.js'],
      entitiesTs: ['src/modules/**/*.entity.ts'],
      debug: false,
    }),

    // Modules
    UserModule,
    AuthModule,
    NotificationsModule,
    ProfilesModule,
    WebsocketModule,
    CoursesModule,
  ],
  controllers: [],
  providers: [TokenService],
})
export class AppModule {}
