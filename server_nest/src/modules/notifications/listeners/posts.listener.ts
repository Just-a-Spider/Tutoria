import { CoursesService } from '@/modules/courses/services/courses.service';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { PostCreatedEvent } from '../events/post-created.event';
import { NotificationsGateway } from '../notifications.gateway';
import { NotificationsService } from '../notifications.service';

@Injectable()
export class PostsEventListener {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly notificationsGateway: NotificationsGateway,
    private readonly coursesService: CoursesService,
  ) {}

  @OnEvent('post.tutor.created')
  async handleTutorPostCreatedEvent(payload: PostCreatedEvent) {
    await this.notificationsService.createNotification(
      true,
      new CreateNotificationDto(
        'Nuevo post de tutor',
        `Nuevo post del tutor ${payload.creatorUsername} en el curso ${payload.courseName}`,
        payload.postId,
        payload.courseId.toString(),
        payload.user,
      ),
    );
    const users = await this.coursesService.getListedMemberFromACourse(
      payload.user,
      payload.courseId,
      'students',
    );
    await this.notificationsGateway.sendNotificationToUsers(
      users,
      `Nuevo post de tutor para ${payload.courseName}`,
    );
  }

  @OnEvent('post.student.created')
  async handleStudentPostCreatedEvent(payload: PostCreatedEvent) {
    await this.notificationsService.createNotification(
      false,
      new CreateNotificationDto(
        'Nuevo post de estudiante',
        `Nueva petición de ayuda de ${payload.creatorUsername} en el curso ${payload.courseName}`,
        payload.postId,
        payload.courseId.toString(),
        payload.user,
      ),
    );
    const tutors = await this.coursesService.getListedMemberFromACourse(
      payload.user,
      payload.courseId,
      'tutors',
    );
    const tryOutTutors = await this.coursesService.getListedMemberFromACourse(
      payload.user,
      payload.courseId,
      'try_out_tutors',
    );
    if (tutors.length === 0 && tryOutTutors.length === 0) {
      return;
    }
    const users = tutors.concat(tryOutTutors);
    await this.notificationsGateway.sendNotificationToUsers(users, {
      type: 'echo.message',
      data: `Nueva solicitud de ayuda parar ${payload.courseName}`,
    });
  }
}
