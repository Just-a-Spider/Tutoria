import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  types,
} from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { Course } from './course.entity';

@Entity({ abstract: true })
export class BasePost {
  @PrimaryKey({ type: types.uuid })
  id: string = uuidv4();

  @Property({ type: types.string })
  title: string;

  @Property({ type: types.string })
  subject: string;

  @Property({ type: types.text })
  description: string;

  @Property({ type: types.datetime, defaultRaw: 'now()' })
  createdAt: Date = new Date();

  @Property({ type: types.datetime, nullable: true })
  updatedAt: Date;

  // Relations
  @ManyToOne({ entity: () => Course })
  course: Course;
}
