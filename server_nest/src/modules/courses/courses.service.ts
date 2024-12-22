import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Course } from './entities/course.entity';
import { ProfilesService } from '../profiles/profiles.service';
import { Faculty } from './entities/faculty.entity';
import { StudentProfile } from '../profiles/entities/profiles.entity';

@Injectable()
export class CoursesService {
  constructor(
    private readonly profilesService: ProfilesService,
    @InjectRepository(Course)
    private readonly courseRepository: EntityRepository<Course>,
    @InjectRepository(Faculty)
    private readonly facultyRepository: EntityRepository<Faculty>,
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
  ): Promise<Course> {
    let course = await this.courseRepository.findOne({ name: courseName });
    if (course) {
      await this.linkStudentToCourse(studentProfile, course.id);
      return course;
    }
    course = await this.courseRepository.create({
      name: courseName,
      faculty: faculty,
    });
    await this.courseRepository.getEntityManager().persistAndFlush(course);
    await this.linkStudentToCourse(studentProfile, course.id);
    return course;
  }

  async linkStudentToCourse(studentProfile: StudentProfile, course: number) {
    const courseEntity = await this.courseRepository.findOne({ id: course });
    courseEntity.students.add(studentProfile);
    await this.courseRepository
      .getEntityManager()
      .persistAndFlush(courseEntity);
  }
}
