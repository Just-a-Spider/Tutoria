import { Migration } from '@mikro-orm/migrations';

export class Migration20241222055212 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "faculty" ("id" serial primary key, "name" varchar(255) not null);`);

    this.addSql(`create table "course" ("id" serial primary key, "name" varchar(255) not null, "faculty_id" int not null);`);

    this.addSql(`create table "course_tutors" ("course_id" int not null, "tutor_profile_id" uuid not null, constraint "course_tutors_pkey" primary key ("course_id", "tutor_profile_id"));`);

    this.addSql(`create table "course_students" ("course_id" int not null, "student_profile_id" uuid not null, constraint "course_students_pkey" primary key ("course_id", "student_profile_id"));`);

    this.addSql(`alter table "course" add constraint "course_faculty_id_foreign" foreign key ("faculty_id") references "faculty" ("id") on update cascade;`);

    this.addSql(`alter table "course_tutors" add constraint "course_tutors_course_id_foreign" foreign key ("course_id") references "course" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "course_tutors" add constraint "course_tutors_tutor_profile_id_foreign" foreign key ("tutor_profile_id") references "tutor_profile" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "course_students" add constraint "course_students_course_id_foreign" foreign key ("course_id") references "course" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "course_students" add constraint "course_students_student_profile_id_foreign" foreign key ("student_profile_id") references "student_profile" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "tutor_profile" alter column "bio" type varchar(255) using ("bio"::varchar(255));`);
    this.addSql(`alter table "tutor_profile" alter column "bio" drop not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "course" drop constraint "course_faculty_id_foreign";`);

    this.addSql(`alter table "course_tutors" drop constraint "course_tutors_course_id_foreign";`);

    this.addSql(`alter table "course_students" drop constraint "course_students_course_id_foreign";`);

    this.addSql(`drop table if exists "faculty" cascade;`);

    this.addSql(`drop table if exists "course" cascade;`);

    this.addSql(`drop table if exists "course_tutors" cascade;`);

    this.addSql(`drop table if exists "course_students" cascade;`);

    this.addSql(`alter table "tutor_profile" alter column "bio" type varchar(255) using ("bio"::varchar(255));`);
    this.addSql(`alter table "tutor_profile" alter column "bio" set not null;`);
  }

}
