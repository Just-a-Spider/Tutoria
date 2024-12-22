import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { Course } from './entities/course.entity';
import { Faculty } from './entities/faculty.entity';
import { ProfilesModule } from '../profiles/profiles.module';

@Module({
  imports: [MikroOrmModule.forFeature([Course, Faculty]), ProfilesModule],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
