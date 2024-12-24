import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ProfilesModule } from '../profiles/profiles.module';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { Course } from './entities/course.entity';
import { Faculty } from './entities/faculty.entity';
import {
  Comment,
  OfferHelpPost,
  RequestHelpPost,
} from './entities/post.entity';
import { TryOutTutor } from './entities/tryout-tutor.entity';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      Course,
      Faculty,
      TryOutTutor,
      RequestHelpPost,
      OfferHelpPost,
      Comment,
    ]),
    ProfilesModule,
  ],
  controllers: [CoursesController, PostsController],
  providers: [CoursesService, PostsService],
  exports: [CoursesService],
})
export class CoursesModule {}
