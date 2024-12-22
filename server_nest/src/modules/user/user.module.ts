import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { User } from './entities/user.entity';
import { PasswordResetTokenRepository } from './repositories/prt.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [MikroOrmModule.forFeature([User, PasswordResetToken])],
  controllers: [UserController],
  providers: [UserService, PasswordResetTokenRepository],
  exports: [UserService],
})
export class UserModule {}
