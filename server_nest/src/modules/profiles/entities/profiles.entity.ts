import { Entity, OneToOne, PrimaryKey, Property, types } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';

@Entity({ abstract: true })
class Profile {
  @PrimaryKey({ type: types.uuid })
  id: string = uuidv4();

  @Property({ type: types.string, nullable: true, default: null })
  profile_picture: string;
}

@Entity()
export class StudentProfile extends Profile {
  // Relationship 1 to 1 to User
  @OneToOne({
    entity: 'User',
    inversedBy: 'student_profile',
    owner: true,
    orphanRemoval: true,
  })
  user: any;
}

@Entity()
export class TutorProfile extends Profile {
  @Property({ type: types.string, nullable: true, default: null })
  bio: string;

  @Property({ type: types.float, default: 0.0 })
  rating: number;

  @Property({ type: types.integer, default: 0 })
  helped: number;

  // Relationship 1 to 1 to User
  @OneToOne({
    entity: 'User',
    inversedBy: 'tutor_profile',
    owner: true,
    orphanRemoval: true,
  })
  user: any;
}
