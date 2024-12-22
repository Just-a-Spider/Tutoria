import { Entity, PrimaryKey, Property, Unique, types } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { PasswordResetTokenRepository } from '../repositories/prt.repository';

@Entity({ repository: () => PasswordResetTokenRepository })
@Unique({ properties: ['token', 'email'] })
export class PasswordResetToken {
  // properties
  @PrimaryKey({ type: types.string })
  token!: string;

  @Property({ type: types.string })
  email!: string;

  @Property({ type: types.datetime, default: 'now()' })
  created_at = new Date();

  @Property({ type: types.datetime })
  expires_at!: Date;

  constructor(email: string) {
    this.email = email;
    this.token = uuidv4();
    // Expire in 1 hour
    this.expires_at = new Date(Date.now() + 1000 * 60 * 60);
  }
}
