import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CoursesService } from './courses.service';

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
}
