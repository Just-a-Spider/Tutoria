import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import { StudentProfile, TutorProfile } from './entities/profiles.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(StudentProfile)
    private readonly studentProfileRepository: EntityRepository<StudentProfile>,
    @InjectRepository(TutorProfile)
    private readonly tutorProfileRepository: EntityRepository<TutorProfile>,
  ) {}

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

  async getBothProfiles(userId: number): Promise<{
    studentProfile: string;
    tutorProfile: string;
  }> {
    const studentProfile = await this.studentProfileRepository.findOne({
      user: userId,
    });
    const tutorProfile = await this.tutorProfileRepository.findOne({
      user: userId,
    });

    return {
      studentProfile: studentProfile?.id,
      tutorProfile: tutorProfile?.id,
    };
  }

  async updateProfilePicture(
    userId: number,
    file: Express.Multer.File,
  ): Promise<string> {
    const profile =
      (await this.studentProfileRepository.findOne({ user: userId })) ||
      (await this.tutorProfileRepository.findOne({ user: userId }));

    if (!profile) {
      throw new Error('Profile not found');
    }

    // Delete the current profile picture if it exists
    if (profile.profile_picture) {
      await fs.unlink(
        join(__dirname, '..', '..', '..', profile.profile_picture),
      );
    }

    profile.profile_picture = file.path;
    await this.studentProfileRepository.nativeDelete({ user: userId });

    return profile.profile_picture;
  }
}
