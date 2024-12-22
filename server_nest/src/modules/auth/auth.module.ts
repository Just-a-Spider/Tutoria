import { JwtStrategy } from '@/strategies/jwt.strategy';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from '@modules/user/entities/user.entity';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CoursesModule } from '../courses/courses.module';
import { ProfilesModule } from '../profiles/profiles.module';
import { UserModule } from '../user/user.module';
import { AuthController, OAuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    UserModule,
    ProfilesModule,
    CoursesModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET || 'secret',
        signOptions: { expiresIn: '1h' },
      }),
    }),
    MikroOrmModule.forFeature([User]),
  ],
  providers: [AuthService, JwtStrategy, GoogleStrategy],
  exports: [AuthService],
  controllers: [AuthController, OAuthController],
})
export class AuthModule {}
