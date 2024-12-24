import { User } from '@/modules/user/entities/user.entity';
import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  types,
} from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { RequestHelpPost } from './request-help-post.entity';
import { OfferHelpPost } from './offer-help-post.entity';

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
