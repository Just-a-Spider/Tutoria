import { TutorProfile } from '@/modules/profiles/entities/profiles.entity';
import { Collection, Entity, ManyToOne, OneToMany } from '@mikro-orm/core';
import { BasePost } from './base-post.entity';
import { Comment } from './comment.entity';

@Entity()
export class OfferHelpPost extends BasePost {
  @ManyToOne({ entity: () => TutorProfile })
  tutor: TutorProfile;

  @OneToMany(() => Comment, (comment) => comment.offerHelpPost)
  comments = new Collection<Comment>(this);
}
