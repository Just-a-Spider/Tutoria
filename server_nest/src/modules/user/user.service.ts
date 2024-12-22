import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { PasswordResetTokenRepository } from './repositories/prt.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly prtRepository: PasswordResetTokenRepository,
  ) {}

  async findAllUsers() {
    return this.userRepository.findAll();
  }

  async findUserById(id: number) {
    return this.userRepository.findOne({ id });
  }

  async findUserByUsername(username: string) {
    return this.userRepository.findOne({ username });
  }

  async findUserByEmailOrUsername(
    emailOrUsername: string,
  ): Promise<User | null> {
    return this.userRepository.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });
  }

  async createRandomUsername(): Promise<string> {
    const adjectives = [
      'Quick',
      'Lazy',
      'Sleepy',
      'Noisy',
      'Hungry',
      'Brave',
      'Calm',
      'Eager',
      'Fancy',
      'Gentle',
    ];
    const nouns = [
      'Panda',
      'Tiger',
      'Elephant',
      'Lion',
      'Giraffe',
      'Zebra',
      'Monkey',
      'Kangaroo',
      'Penguin',
      'Dolphin',
    ];
    // Set of 4 random numbers
    const numbers = Array.from({ length: 4 }, () =>
      Math.floor(Math.random() * 10),
    );

    while (true) {
      const username = `${adjectives[numbers[0]]}${nouns[numbers[1]]}${
        numbers[2]
      }${numbers[3]}`;
      const user = await this.findUserByUsername(username);
      if (!user) {
        return username;
      }
    }
  }

  // For Google OAuth
  async findOrCreateUser(
    payload: any,
  ): Promise<{ user: User; created: boolean }> {
    let user = await this.userRepository.findOne({ email: payload.email });
    if (!user) {
      const username = await this.createRandomUsername();
      // Create a new one with no password
      user = this.userRepository.create({
        email: payload.email,
        username: username,
        first_name: payload.given_name,
        last_name: payload.family_name,
        googleId: payload.sub,
      });
      await this.userRepository.getEntityManager().persistAndFlush(user);
      return { user, created: true };
    }
    return { user, created: false };
  }
}
