import { Migration } from '@mikro-orm/migrations';

export class Migration20241222075749 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "user" add column "google_id" varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user" drop column "google_id";`);
  }

}
