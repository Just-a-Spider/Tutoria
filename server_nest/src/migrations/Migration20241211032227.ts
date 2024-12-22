import { Migration } from '@mikro-orm/migrations';

export class Migration20241211032227 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "tutor_notification" ("id" uuid not null, "title" varchar(100) not null, "content" text not null, "created_at" timestamptz not null, "read" boolean not null default false, "instance_id" uuid null, "subinstance_id" uuid null, "user_id" int not null, constraint "tutor_notification_pkey" primary key ("id"));`,
    );

    this.addSql(
      `create table "student_notification" ("id" uuid not null, "title" varchar(100) not null, "content" text not null, "created_at" timestamptz not null, "read" boolean not null default false, "instance_id" uuid null, "subinstance_id" uuid null, "user_id" int not null, constraint "student_notification_pkey" primary key ("id"));`,
    );

    this.addSql(
      `alter table "tutor_notification" add constraint "tutor_notification_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`,
    );

    this.addSql(
      `alter table "student_notification" add constraint "student_notification_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "tutor_notification" cascade;`);

    this.addSql(`drop table if exists "student_notification" cascade;`);
  }
}
