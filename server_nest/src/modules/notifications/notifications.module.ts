import { WebsocketModule } from '@/utils/websocket.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CoursesModule } from '../courses/courses.module';
import {
  StudentNotification,
  TutorNotification,
} from './entities/notification.entity';
import { PostsEventListener } from './listeners/posts.listener';
import { NotificationsController } from './notifications.controller';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [
    WebsocketModule,
    CoursesModule,
    MikroOrmModule.forFeature([StudentNotification, TutorNotification]),
  ],
  providers: [NotificationsService, NotificationsGateway, PostsEventListener],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
