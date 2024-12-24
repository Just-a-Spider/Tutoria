import {
  StudentProfile,
  TutorProfile,
} from '@/modules/profiles/entities/profiles.entity';
import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property,
  types,
} from '@mikro-orm/core';
import { Faculty } from './faculty.entity';
import { TryOutTutor } from './tryout-tutor.entity';

@Entity()
export class Course {
  @PrimaryKey({ type: types.integer })
  id: number;

  @Property({ type: types.string })
  name: string;

  @ManyToOne({ entity: () => Faculty })
  faculty: Faculty;

  @ManyToMany(() => StudentProfile)
  students = new Collection<StudentProfile>(this);

  @ManyToMany(() => TutorProfile)
  tutors = new Collection<TutorProfile>(this);

  @ManyToMany(() => TryOutTutor)
  try_out_tutors = new Collection<TryOutTutor>(this);
}
