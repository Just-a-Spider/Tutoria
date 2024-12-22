import { Migration } from '@mikro-orm/migrations';

export class Migration20241210232431 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "password_reset_token" ("token" varchar(255) not null, "email" varchar(255) not null, "created_at" timestamptz not null default 'now()', "expires_at" timestamptz not null, constraint "password_reset_token_pkey" primary key ("token"));`,
    );
    this.addSql(
      `alter table "password_reset_token" add constraint "password_reset_token_token_email_unique" unique ("token", "email");`,
    );

    this.addSql(
      `create table "user" ("id" serial primary key, "username" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "date_joined" timestamptz not null default 'now()', "last_login" timestamptz not null, "is_staff" boolean not null default false, "is_active" boolean not null default true);`,
    );
  }
}
