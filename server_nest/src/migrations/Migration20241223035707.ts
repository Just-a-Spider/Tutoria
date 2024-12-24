import { Migration } from '@mikro-orm/migrations';

export class Migration20241223035707 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`drop table if exists "base_post" cascade;`);

    this.addSql(`drop index "offer_help_post_type_index";`);
    this.addSql(`alter table "offer_help_post" drop column "type";`);

    this.addSql(`drop index "request_help_post_type_index";`);
    this.addSql(`alter table "request_help_post" drop column "type";`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "base_post" ("id" uuid not null, "title" varchar(255) not null, "subject" varchar(255) not null, "description" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz null, "course_id" int not null, "type" text check ("type" in ('')) not null, constraint "base_post_pkey" primary key ("id"));`);
    this.addSql(`create index "base_post_type_index" on "base_post" ("type");`);

    this.addSql(`alter table "base_post" add constraint "base_post_course_id_foreign" foreign key ("course_id") references "course" ("id") on update cascade;`);

    this.addSql(`alter table "offer_help_post" add column "type" text check ("type" in ('')) not null;`);
    this.addSql(`create index "offer_help_post_type_index" on "offer_help_post" ("type");`);

    this.addSql(`alter table "request_help_post" add column "type" text check ("type" in ('')) not null;`);
    this.addSql(`create index "request_help_post_type_index" on "request_help_post" ("type");`);
  }

}
