/* eslint-disable @typescript-eslint/no-unused-vars */
import { User } from '@/modules/user/entities/user.entity';
import { hash } from '@/utils/bcrypt.util';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ProfilesService } from '@modules/profiles/profiles.service';
import { UserService } from '@modules/user/user.service';
import { Injectable, Logger } from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CoursesService } from '../courses/courses.service';
import { CreateUserDto } from './dto/create-user.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import { LoginDto } from './dto/login.dto';
import { oauthClient } from './oauth/client';

@Injectable()
export class AuthService {
  // Logger
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UserService,
    private readonly profilesService: ProfilesService,
    private readonly coursesService: CoursesService,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findUserByUsername(username);
    if (user && bcrypt.compareSync(pass, user.password)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async register(createUserDto: CreateUserDto) {
    try {
      createUserDto.password = await hash(createUserDto.password);
      const user = await this.userRepository.create(createUserDto);
      await this.userRepository.getEntityManager().persistAndFlush(user);
      // Create the Profiles too
      await this.profilesService.createBothProfiles(user.id);
      // Logger
      return { message: 'Usuario registrado con éxito' };
    } catch (error) {
      console.error(error);
      throw new HttpErrorByCode[500]('Error al registrar el usuario');
    }
  }

  async login(loginDto: LoginDto) {
    const { email_username, password } = loginDto;
    const user =
      await this.usersService.findUserByEmailOrUsername(email_username);
    if (!user) {
      return { message: 'Usuario no encontrado' };
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { message: 'Credenciales incorrectas' };
    }
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // For Google OAuth
  async getGoogleOAuthUrl(): Promise<string> {
    return oauthClient.generateAuthUrl({
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/classroom.courses.readonly',
        'https://www.googleapis.com/auth/classroom.rosters.readonly',
      ],
      prompt: 'consent',
    });
  }

  async googleLogin(googleLoginDto: GoogleLoginDto): Promise<any> {
    const ticket = await oauthClient.verifyIdToken({
      idToken: googleLoginDto.idToken,
      audience:
        process.env.GOOGLE_CLIENT_ID ||
        '537012742971-r468a4u676c5vruvd6rsrjhd36vdqp10.apps.googleusercontent.com',
    });
    const googlePayload = ticket.getPayload();
    const { user, created } =
      await this.usersService.findOrCreateUser(googlePayload);
    await this.fetchGoogleClassroomCourses(user, googleLoginDto.accessToken);
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async fetchGoogleClassroomCourses(user: User, accessToken: string) {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    try {
      const response = await fetch(
        'https://classroom.googleapis.com/v1/courses',
        {
          headers,
        },
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        this.logger.error(
          `Error fetching courses: ${errorResponse.error.message}`,
        );
        return;
      }

      const data = await response.json();

      const coursesData = data.courses;
      const { studentProfile, tutorProfile, created } =
        await this.profilesService.findOrCreateBothProfiles(user.id);

      for (const courseData of coursesData) {
        if (courseData.courseState !== 'ACTIVE') {
          continue;
        }

        const courseName = courseData.name;
        const courseFaculty = courseData.descriptionHeading.split(': ')[1];

        const { faculty } =
          await this.coursesService.findOrCreateFaculty(courseFaculty);

        const course = await this.coursesService.findOrCreateCourse(
          courseName,
          faculty.id,
          studentProfile,
        );
      }
    } catch (error) {
      this.logger.error(`Error creating courses: ${error.message || error}`);
    }
  }
}
