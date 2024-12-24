import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import { StudentProfile, TutorProfile } from './entities/profiles.entity';

@Injectable()
export class ProfilesService {
  private logger: Logger = new Logger(ProfilesService.name);

  constructor(
    @InjectRepository(StudentProfile)
    private readonly studentProfileRepository: EntityRepository<StudentProfile>,
    @InjectRepository(TutorProfile)
    private readonly tutorProfileRepository: EntityRepository<TutorProfile>,
  ) {}

  // Helper methods
  async getBothProfiles(
    userId: number,
    mode: 'student' | 'tutor' | 'both' = 'both',
  ): Promise<{
    studentProfile?: StudentProfile;
    tutorProfile?: TutorProfile;
  }> {
    let studentProfile: StudentProfile | undefined;
    let tutorProfile: TutorProfile | undefined;

    if (mode === 'student' || mode === 'both') {
      studentProfile = await this.studentProfileRepository.findOne({
        user: userId,
      });
    }

    if (mode === 'tutor' || mode === 'both') {
      tutorProfile = await this.tutorProfileRepository.findOne({
        user: userId,
      });
    }

    return {
      studentProfile,
      tutorProfile,
    };
  }

  async updateProfilePicture(
    userId: number,
    file: Express.Multer.File,
    mode: 'student' | 'tutor',
  ): Promise<string> {
    this.logger.log(mode);
    const profile =
      mode === 'student'
        ? await this.getBothProfiles(userId, 'student')
        : await this.getBothProfiles(userId, 'tutor');

    const selectecProfile =
      mode === 'student' ? profile.studentProfile : profile.tutorProfile;

    const em =
      mode === 'student'
        ? this.studentProfileRepository
        : this.tutorProfileRepository;

    if (!selectecProfile) {
      throw new Error('Profile not found');
    }

    // Delete the current profile picture if it exists
    if (selectecProfile.profile_picture) {
      await fs.unlink(join(process.cwd(), selectecProfile.profile_picture));
    }

    selectecProfile.profile_picture = file.path;
    await em.getEntityManager().flush();

    return selectecProfile.profile_picture;
  }

  // Helper methods
  async findOrCreateBothProfiles(userId: number): Promise<{
    studentProfile: StudentProfile;
    tutorProfile: TutorProfile;
    created: boolean;
  }> {
    const studentProfile = await this.studentProfileRepository.findOne({
      user: userId,
    });
    const tutorProfile = await this.tutorProfileRepository.findOne({
      user: userId,
    });

    if (studentProfile && tutorProfile) {
      return {
        studentProfile: studentProfile,
        tutorProfile: tutorProfile,
        created: false,
      };
    }

    const { newStudentProfile, newTutorProfile } =
      await this.createBothProfiles(userId);
    return {
      studentProfile: newStudentProfile,
      tutorProfile: newTutorProfile,
      created: true,
    };
  }

  async createBothProfiles(userId: number): Promise<{
    newStudentProfile: StudentProfile;
    newTutorProfile: TutorProfile;
  }> {
    const studentProfile = this.studentProfileRepository.create({
      user: userId,
    });
    const tutorProfile = this.tutorProfileRepository.create({ user: userId });

    await this.studentProfileRepository
      .getEntityManager()
      .persistAndFlush(studentProfile);
    await this.tutorProfileRepository
      .getEntityManager()
      .persistAndFlush(tutorProfile);

    return {
      newStudentProfile: studentProfile,
      newTutorProfile: tutorProfile,
    };
  }
}
