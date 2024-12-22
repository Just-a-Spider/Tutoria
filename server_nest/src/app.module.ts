import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import mikroOrmConfig from './mikro-orm.config';
import { AuthModule } from './modules/auth/auth.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { UserModule } from './modules/user/user.module';
import { TokenService } from './utils/token.service';
import { WebsocketModule } from './utils/websocket.module';
import { CoursesModule } from './modules/courses/courses.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '1h' },
    }),
    MikroOrmModule.forRoot({ ...mikroOrmConfig }),
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
