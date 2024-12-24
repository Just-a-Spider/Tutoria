import { Migration } from '@mikro-orm/migrations';

export class Migration20241223013140 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "base_post" ("id" uuid not null, "title" varchar(255) not null, "subject" varchar(255) not null, "description" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz null, "course_id" int not null, "type" text check ("type" in ('')) not null, constraint "base_post_pkey" primary key ("id"));`);
    this.addSql(`create index "base_post_type_index" on "base_post" ("type");`);

    this.addSql(`create table "offer_help_post" ("id" uuid not null, "title" varchar(255) not null, "subject" varchar(255) not null, "description" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz null, "course_id" int not null, "type" text check ("type" in ('')) not null, "tutor_id" uuid not null, constraint "offer_help_post_pkey" primary key ("id"));`);
    this.addSql(`create index "offer_help_post_type_index" on "offer_help_post" ("type");`);

    this.addSql(`create table "request_help_post" ("id" uuid not null, "title" varchar(255) not null, "subject" varchar(255) not null, "description" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz null, "course_id" int not null, "type" text check ("type" in ('')) not null, "student_id" uuid not null, constraint "request_help_post_pkey" primary key ("id"));`);
    this.addSql(`create index "request_help_post_type_index" on "request_help_post" ("type");`);

    this.addSql(`create table "comment" ("id" uuid not null, "content" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz null, "pfp_url" varchar(255) null, "request_help_post_id" uuid null, "offer_help_post_id" uuid null, "user_id" int not null, constraint "comment_pkey" primary key ("id"));`);

    this.addSql(`alter table "base_post" add constraint "base_post_course_id_foreign" foreign key ("course_id") references "course" ("id") on update cascade;`);

    this.addSql(`alter table "offer_help_post" add constraint "offer_help_post_course_id_foreign" foreign key ("course_id") references "course" ("id") on update cascade;`);
    this.addSql(`alter table "offer_help_post" add constraint "offer_help_post_tutor_id_foreign" foreign key ("tutor_id") references "tutor_profile" ("id") on update cascade;`);

    this.addSql(`alter table "request_help_post" add constraint "request_help_post_course_id_foreign" foreign key ("course_id") references "course" ("id") on update cascade;`);
    this.addSql(`alter table "request_help_post" add constraint "request_help_post_student_id_foreign" foreign key ("student_id") references "student_profile" ("id") on update cascade;`);

    this.addSql(`alter table "comment" add constraint "comment_request_help_post_id_foreign" foreign key ("request_help_post_id") references "request_help_post" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "comment" add constraint "comment_offer_help_post_id_foreign" foreign key ("offer_help_post_id") references "offer_help_post" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "comment" add constraint "comment_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "comment" drop constraint "comment_offer_help_post_id_foreign";`);

    this.addSql(`alter table "comment" drop constraint "comment_request_help_post_id_foreign";`);

    this.addSql(`drop table if exists "base_post" cascade;`);

    this.addSql(`drop table if exists "offer_help_post" cascade;`);

    this.addSql(`drop table if exists "request_help_post" cascade;`);

    this.addSql(`drop table if exists "comment" cascade;`);
  }

}
