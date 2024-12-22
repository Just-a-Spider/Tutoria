import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { User } from '../../user/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity({ abstract: true })
export abstract class BaseNotification {
  @PrimaryKey({ type: 'uuid' })
  id: string = uuidv4();

  @Property({ length: 100 })
  title: string;

  @Property({ type: 'text' })
  content: string;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ type: 'boolean', default: false })
  read: boolean = false;

  @Property({ type: 'uuid', nullable: true })
  instanceId?: string;

  @Property({ type: 'uuid', nullable: true })
  subinstanceId?: string;

  @ManyToOne(() => User)
  user: User;
}

@Entity()
export class StudentNotification extends BaseNotification {}

@Entity()
export class TutorNotification extends BaseNotification {}
