import { Migration } from '@mikro-orm/migrations';

export class Migration20241224053140 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "tutor_notification" alter column "subinstance_id" type text using ("subinstance_id"::text);`);

    this.addSql(`alter table "student_notification" alter column "subinstance_id" type text using ("subinstance_id"::text);`);

    this.addSql(`alter table "tutor_notification" alter column "subinstance_id" type varchar(255) using ("subinstance_id"::varchar(255));`);

    this.addSql(`alter table "student_notification" alter column "subinstance_id" type varchar(255) using ("subinstance_id"::varchar(255));`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "tutor_notification" alter column "subinstance_id" drop default;`);
    this.addSql(`alter table "tutor_notification" alter column "subinstance_id" type uuid using ("subinstance_id"::text::uuid);`);

    this.addSql(`alter table "student_notification" alter column "subinstance_id" drop default;`);
    this.addSql(`alter table "student_notification" alter column "subinstance_id" type uuid using ("subinstance_id"::text::uuid);`);
  }

}
