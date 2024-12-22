import {
  StudentProfile,
  TutorProfile,
} from '@/modules/profiles/entities/profiles.entity';
import { Entity, OneToOne, PrimaryKey, Property, types } from '@mikro-orm/core';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property({ type: types.string, unique: true })
  username!: string;

  @Property({ type: types.string, unique: true })
  email!: string;

  @Property({ type: types.string, hidden: true, nullable: true })
  @Exclude()
  password!: string;

  @Property({ type: types.string })
  first_name!: string;

  @Property({ type: types.string })
  last_name!: string;

  @Property({ type: types.string, nullable: true, default: null })
  googleId: string; // Optional field for Google login

  @Property({ type: types.datetime, default: 'now()' })
  date_joined = new Date();

  @Property({ type: types.datetime, onUpdate: () => new Date() })
  last_login = new Date();

  @Property({ type: types.boolean, default: false })
  is_staff!: boolean;

  @Property({ type: types.boolean, default: true })
  is_active!: boolean;

  @OneToOne(() => StudentProfile, (studentProfile) => studentProfile.user, {
    nullable: true,
  })
  @Exclude()
  student_profile: StudentProfile;

  @OneToOne(() => TutorProfile, (tutorProfile) => tutorProfile.user, {
    nullable: true,
  })
  @Exclude()
  tutor_profile: TutorProfile;
}
