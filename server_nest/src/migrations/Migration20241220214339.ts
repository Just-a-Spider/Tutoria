import { Migration } from '@mikro-orm/migrations';

export class Migration20241220214339 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "tutor_profile" ("id" uuid not null, "profile_picture" varchar(255) null, "user_id" int not null, "bio" varchar(255) not null, "rating" real not null default 0, "helped" int not null default 0, constraint "tutor_profile_pkey" primary key ("id"));`);
    this.addSql(`alter table "tutor_profile" add constraint "tutor_profile_user_id_unique" unique ("user_id");`);

    this.addSql(`create table "student_profile" ("id" uuid not null, "profile_picture" varchar(255) null, "user_id" int not null, constraint "student_profile_pkey" primary key ("id"));`);
    this.addSql(`alter table "student_profile" add constraint "student_profile_user_id_unique" unique ("user_id");`);

    this.addSql(`alter table "tutor_profile" add constraint "tutor_profile_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "student_profile" add constraint "student_profile_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "tutor_profile" cascade;`);

    this.addSql(`drop table if exists "student_profile" cascade;`);
  }

}
