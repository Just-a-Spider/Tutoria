import {
  StudentProfile,
  TutorProfile,
} from '@/modules/profiles/entities/profiles.entity';
import { User } from '@/modules/user/entities/user.entity';
import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  types,
} from '@mikro-orm/core';
import { Expose } from 'class-transformer';
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

@Entity()
export class RequestHelpPost extends BasePost {
  @ManyToOne({ entity: () => StudentProfile })
  student: StudentProfile;

  @OneToMany(() => Comment, (comment) => comment.requestHelpPost)
  comments = new Collection<Comment>(this);

  // Serializations
  @Expose({ name: 'pfp_url' })
  get pfpUrl() {
    return this.student.profile_picture;
  }
}

@Entity()
export class OfferHelpPost extends BasePost {
  @ManyToOne({ entity: () => TutorProfile })
  tutor: TutorProfile;

  @OneToMany(() => Comment, (comment) => comment.offerHelpPost)
  comments = new Collection<Comment>(this);
}

@Entity()
export class Comment {
  // Own Data
  @PrimaryKey({ type: types.uuid })
  id: string = uuidv4();

  @Property({ type: types.text })
  content: string;

  @Property({ type: types.datetime, defaultRaw: 'now()' })
  createdAt: Date = new Date();

  @Property({ type: types.datetime, nullable: true })
  updatedAt: Date;

  @Property({ type: types.string, nullable: true, default: null })
  pfpUrl: string;

  // References
  @ManyToOne(() => RequestHelpPost, { nullable: true })
  requestHelpPost?: RequestHelpPost;

  @ManyToOne(() => OfferHelpPost, { nullable: true })
  offerHelpPost?: OfferHelpPost;

  // Relations
  @ManyToOne({ entity: () => User })
  user: User;
}
