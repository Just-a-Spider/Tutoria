import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import {
  StudentProfile,
  TutorProfile,
} from '../../profiles/entities/profiles.entity';
import { ProfilesService } from '../../profiles/profiles.service';
import { CourseDto } from '../dto/course.dto';
import { Course } from '../entities/course.entity';
import { Faculty } from '../entities/faculty.entity';
import { TryOutTutor } from '../entities/tryout-tutor.entity';

@Injectable()
export class CoursesService {
  constructor(
    private readonly profilesService: ProfilesService,
    @InjectRepository(Course)
    private readonly courseRepository: EntityRepository<Course>,
    @InjectRepository(Faculty)
    private readonly facultyRepository: EntityRepository<Faculty>,
    @InjectRepository(TryOutTutor)
    private readonly tryOutTutorRepository: EntityRepository<TryOutTutor>,
  ) {}

  async getListedCourses(userId: number): Promise<Course[]> {
    const { studentProfile, tutorProfile } =
      await this.profilesService.getBothProfiles(userId);
    // Return all courses that are not joined by the student or tutor
    return this.courseRepository.find({
      $and: [
        { students: { $ne: studentProfile } },
        { tutors: { $ne: tutorProfile } },
      ],
    });
  }

  async getMyCourses(userId: number): Promise<Course[]> {
    const { studentProfile, tutorProfile } =
      await this.profilesService.getBothProfiles(userId);
    // Return courses where the user is either a student or a tutor
    return this.courseRepository.find({
      $or: [
        { students: studentProfile },
        { tutors: tutorProfile },
        { $and: [{ students: studentProfile }, { tutors: tutorProfile }] },
      ],
    });
  }

  async getCourseById(courseId: number, userId: number): Promise<CourseDto> {
    const course = await this.courseRepository.findOne(
      { id: courseId },
      { populate: ['faculty', 'students', 'tutors', 'try_out_tutors'] },
    );

    if (!course) {
      throw new Error(`Course with id ${courseId} not found`);
    }

    const { studentProfile, tutorProfile } =
      await this.profilesService.getBothProfiles(userId);

    const isStudent = course.students.contains(studentProfile);
    const isTutor = course.tutors.contains(tutorProfile);
    const { isTryOut } = await this.isTryOutTutor(courseId, tutorProfile);
    const isTryOutTutor = isTryOut;

    const courseDto = plainToClass(CourseDto, {
      ...course,
      faculty: course.faculty.name,
      students: course.students.count(),
      tutors: course.tutors.count(),
      try_out_tutors: course.try_out_tutors.count(),
      is_student: isStudent,
      is_tutor: isTutor,
      is_try_out_tutor: isTryOutTutor,
    });

    return courseDto;
  }

  async linkStudentToCourse(studentProfile: StudentProfile, course: number) {
    const courseEntity = await this.courseRepository.findOne(
      { id: course },
      { populate: ['students'] },
    );
    // Check if the student is already linked to the course
    if (courseEntity.students.contains(studentProfile)) {
      return;
    }
    courseEntity.students.add(studentProfile);
    await this.courseRepository
      .getEntityManager()
      .persistAndFlush(courseEntity);
  }

  async addRemoveStudentTutorFromCourse(
    userId: number,
    courseId: number,
    mode: 'add' | 'remove',
    isStudent: boolean,
  ) {
    const { studentProfile, tutorProfile } =
      await this.profilesService.getBothProfiles(userId);
    const course = await this.courseRepository.findOneOrFail(
      { id: courseId },
      { populate: ['students', 'tutors', 'try_out_tutors'] },
    );

    const profile = isStudent ? studentProfile : tutorProfile;

    if (!isStudent) {
      const { isTryOut, tryOutTutor } = await this.isTryOutTutor(
        courseId,
        tutorProfile,
      );
      if (mode === 'add' && !isTryOut && !tryOutTutor) {
        const newTryOutTutor = this.tryOutTutorRepository.create({
          tutor: tutorProfile,
        });
        course.try_out_tutors.add(newTryOutTutor);
        await this.tryOutTutorRepository
          .getEntityManager()
          .persistAndFlush(newTryOutTutor);
      } else if (mode === 'remove' && isTryOut && tryOutTutor) {
        course.try_out_tutors.remove(tryOutTutor);
        await this.tryOutTutorRepository
          .getEntityManager()
          .removeAndFlush(tryOutTutor);
      }
      this.courseRepository.getEntityManager().persistAndFlush(course);
      return;
    }

    const collection = isStudent ? course.students : course.tutors;

    if (mode === 'add') {
      collection.add(profile);
    } else {
      collection.remove(profile);
    }

    await this.courseRepository.getEntityManager().persistAndFlush(course);
  }

  async isTryOutTutor(
    courseId: number,
    tutorProfile: TutorProfile,
  ): Promise<{ isTryOut: boolean; tryOutTutor: TryOutTutor }> {
    const course = await this.courseRepository.findOne(
      { id: courseId },
      { populate: ['try_out_tutors'] },
    );

    if (!course) {
      throw new Error(`Course with id ${courseId} not found`);
    }

    // Get the TryOutTutor from the tutorProfile
    const tryOutTutor = await this.tryOutTutorRepository.findOne({
      tutor: tutorProfile,
    });

    return {
      isTryOut: course.try_out_tutors.contains(tryOutTutor),
      tryOutTutor: tryOutTutor,
    };
  }

  // Helper methods
  async findOrCreateFaculty(
    facultyName: string,
  ): Promise<{ faculty: Faculty; created: boolean }> {
    let faculty = await this.facultyRepository.findOne({ name: facultyName });
    if (faculty) {
      return { faculty: faculty, created: false };
    }
    faculty = await this.facultyRepository.create({ name: facultyName });
    await this.facultyRepository.getEntityManager().persistAndFlush(faculty);
    return { faculty: faculty, created: true };
  }

  async findOrCreateCourse(
    courseName: string,
    faculty: number,
    studentProfile: StudentProfile,
  ): Promise<{ course: Course; created: boolean }> {
    let course = await this.courseRepository.findOne({ name: courseName });
    if (course) {
      await this.linkStudentToCourse(studentProfile, course.id);
      return { course: course, created: false };
    }
    course = await this.courseRepository.create({
      name: courseName,
      faculty: faculty,
    });
    await this.courseRepository.getEntityManager().persistAndFlush(course);
    await this.linkStudentToCourse(studentProfile, course.id);
    return { course: course, created: true };
  }

  async getListedMemberFromACourse(
    userId: number,
    courseId: number,
    mode: 'students' | 'tutors' | 'try_out_tutors',
  ): Promise<number[]> {
    const course = await this.courseRepository.findOneOrFail(
      { id: courseId },
      { populate: [mode] },
    );

    const usersId = course[mode]
      .getItems()
      .map((profile: StudentProfile | TutorProfile | TryOutTutor) => {
        if (profile instanceof TryOutTutor) {
          return profile.tutor.user.id;
        } else {
          return profile.user.id;
        }
      })
      .filter((id: number) => id !== userId);

    return usersId;
  }
}
