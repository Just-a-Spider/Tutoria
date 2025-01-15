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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Courses')
@Controller('courses')
@UseGuards(JwtAuthGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get('')
  @ApiOperation({ summary: 'Get my courses' })
  @ApiResponse({ status: 200, description: 'List of my courses' })
  getMyCourses(@Req() req) {
    const userId = req.user.id;
    return this.coursesService.getMyCourses(userId);
  }

  @Get('all-courses')
  @ApiOperation({ summary: 'Get all listed courses' })
  @ApiResponse({ status: 200, description: 'List of all courses' })
  getListedCourses(@Req() req) {
    const userId = req.user.id;
    return this.coursesService.getListedCourses(userId);
  }

  @Get(':courseId')
  @ApiOperation({ summary: 'Get course by ID' })
  @ApiResponse({ status: 200, description: 'Course details' })
  getCourseById(@Req() req) {
    const userId = req.user.id;
    const courseId = req.params.courseId;
    return this.coursesService.getCourseById(courseId, userId);
  }

  @Post(':courseId/students')
  @ApiOperation({ summary: 'Join course as student' })
  @ApiResponse({ status: 201, description: 'Joined course as student' })
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
  @ApiOperation({ summary: 'Leave course as student' })
  @ApiResponse({ status: 200, description: 'Left course as student' })
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
  @ApiOperation({ summary: 'Join course as tutor' })
  @ApiResponse({ status: 201, description: 'Joined course as tutor' })
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
  @ApiOperation({ summary: 'Leave course as tutor' })
  @ApiResponse({ status: 200, description: 'Left course as tutor' })
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
