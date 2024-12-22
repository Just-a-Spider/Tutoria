import { EntityRepository } from '@mikro-orm/postgresql';
import { PasswordResetToken } from '../entities/password-reset-token.entity';

export class PasswordResetTokenRepository extends EntityRepository<PasswordResetToken> {
  // methods
  async save(email: string): Promise<PasswordResetToken> {
    const token = new PasswordResetToken(email);
    await this.em.persistAndFlush(token);
    return token;
  }

  async deletePrevoiusTokens(email: string) {
    const tokens = await this.em.find(PasswordResetToken, { email });
    tokens.forEach(async (token) => {
      await this.em.removeAndFlush(token);
    });
  }

  async findOneByToken(token: string) {
    return this.findOne({ token });
  }

  async findOneByEmail(email: string) {
    return this.findOne({ email });
  }
}
