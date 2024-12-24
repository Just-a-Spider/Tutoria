import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt.guard';
import { CoursesService } from '../services/courses.service';

@Controller('courses')
@UseGuards(JwtAuthGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get('')
  getMyCourses(@Req() req) {
    const userId = req.user.id;
    return this.coursesService.getMyCourses(userId);
  }

  @Get('all-courses')
  getListedCourses(@Req() req) {
    const userId = req.user.id;
    return this.coursesService.getListedCourses(userId);
  }

  @Get(':courseId')
  getCourseById(@Req() req) {
    const userId = req.user.id;
    const courseId = req.params.courseId;
    return this.coursesService.getCourseById(courseId, userId);
  }

  @Post(':courseId/students')
  joinCourseAsStudent(@Req() req, @Param('courseId') courseId: number) {
    const userId = req.user.id;
    return this.coursesService.addRemoveStudentTutorFromCourse(
      userId,
      courseId,
      'add',
      true,
    );
  }

  @Delete(':courseId/students')
  leaveCourseAsStudent(@Req() req, @Param('courseId') courseId: number) {
    const userId = req.user.id;
    return this.coursesService.addRemoveStudentTutorFromCourse(
      userId,
      courseId,
      'remove',
      true,
    );
  }

  @Post(':courseId/tutors')
  joinCourseAsTutor(@Req() req, @Param('courseId') courseId: number) {
    const userId = req.user.id;
    return this.coursesService.addRemoveStudentTutorFromCourse(
      userId,
      courseId,
      'add',
      false,
    );
  }

  @Delete(':courseId/tutors')
  leaveCourseAsTutor(@Req() req, @Param('courseId') courseId: number) {
    const userId = req.user.id;
    return this.coursesService.addRemoveStudentTutorFromCourse(
      userId,
      courseId,
      'remove',
      false,
    );
  }
}
