import { Entity, PrimaryKey, Property, types } from '@mikro-orm/core';

@Entity()
export class Faculty {
  @PrimaryKey({ type: types.integer })
  id: number;

  @Property({ type: types.string })
  name: string;
}
