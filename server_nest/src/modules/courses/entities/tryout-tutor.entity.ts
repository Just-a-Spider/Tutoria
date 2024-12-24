import { TutorProfile } from '@/modules/profiles/entities/profiles.entity';
import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  types,
} from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class TryOutTutor {
  @PrimaryKey({ type: types.uuid })
  id: string = uuidv4();

  @Property({ type: types.datetime, defaultRaw: 'now()' })
  started_at!: Date;

  @Property({
    type: types.datetime,
    nullable: true,
    defaultRaw: 'null',
    onUpdate: () => new Date(),
  })
  last_tryout: Date;

  @Property({ type: types.integer, defaultRaw: '3' })
  tryouts_left!: number;

  @Property({ type: types.float, defaultRaw: '0.0' })
  calification!: number;

  // Relations
  @ManyToOne({ entity: () => TutorProfile })
  tutor: TutorProfile;
}
