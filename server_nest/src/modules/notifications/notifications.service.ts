import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import {
  StudentNotification,
  TutorNotification,
} from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(StudentNotification)
    private readonly studentNotificationRepository: EntityRepository<StudentNotification>,
    @InjectRepository(TutorNotification)
    private readonly tutorNotificationRepository: EntityRepository<TutorNotification>,
  ) {}

  async createNotification(
    forStudent: boolean,
    notificationData: CreateNotificationDto,
  ): Promise<void> {
    if (forStudent) {
      const noti = this.studentNotificationRepository.create(notificationData);
      this.studentNotificationRepository
        .getEntityManager()
        .persistAndFlush(noti);
    } else {
      const noti = this.tutorNotificationRepository.create(notificationData);
      this.tutorNotificationRepository.getEntityManager().persistAndFlush(noti);
    }
  }

  async getStudentNotifications(
    userId: number,
  ): Promise<StudentNotification[]> {
    return this.studentNotificationRepository.find({ user: userId });
  }

  async getTutorNotifications(userId: number): Promise<TutorNotification[]> {
    return this.tutorNotificationRepository.find({ user: userId });
  }
}
