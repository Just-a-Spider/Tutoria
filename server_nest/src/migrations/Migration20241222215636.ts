import { Migration } from '@mikro-orm/migrations';

export class Migration20241222215636 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "try_out_tutor" ("id" uuid not null, "started_at" timestamptz not null default now(), "last_tryout" timestamptz null, "tryouts_left" int not null default 3, "calification" real not null default 0.0, "tutor_id" uuid not null, constraint "try_out_tutor_pkey" primary key ("id"));`);

    this.addSql(`create table "course_try_out_tutors" ("course_id" int not null, "try_out_tutor_id" uuid not null, constraint "course_try_out_tutors_pkey" primary key ("course_id", "try_out_tutor_id"));`);

    this.addSql(`alter table "try_out_tutor" add constraint "try_out_tutor_tutor_id_foreign" foreign key ("tutor_id") references "tutor_profile" ("id") on update cascade;`);

    this.addSql(`alter table "course_try_out_tutors" add constraint "course_try_out_tutors_course_id_foreign" foreign key ("course_id") references "course" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "course_try_out_tutors" add constraint "course_try_out_tutors_try_out_tutor_id_foreign" foreign key ("try_out_tutor_id") references "try_out_tutor" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "course_try_out_tutors" drop constraint "course_try_out_tutors_try_out_tutor_id_foreign";`);

    this.addSql(`drop table if exists "try_out_tutor" cascade;`);

    this.addSql(`drop table if exists "course_try_out_tutors" cascade;`);
  }

}
