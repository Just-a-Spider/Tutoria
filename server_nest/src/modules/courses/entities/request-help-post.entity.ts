import { StudentProfile } from '@/modules/profiles/entities/profiles.entity';
import { Collection, Entity, ManyToOne, OneToMany } from '@mikro-orm/core';
import { BasePost } from './base-post.entity';
import { Comment } from './comment.entity';

@Entity()
export class RequestHelpPost extends BasePost {
  @ManyToOne({ entity: () => StudentProfile })
  student: StudentProfile;

  @OneToMany(() => Comment, (comment) => comment.requestHelpPost)
  comments = new Collection<Comment>(this);
}
