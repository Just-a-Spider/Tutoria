import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ProfilesModule } from '../profiles/profiles.module';
import { CoursesController } from './controllers/courses.controller';
import { PostsController } from './controllers/posts.controller';
import { Comment } from './entities/comment.entity';
import { Course } from './entities/course.entity';
import { Faculty } from './entities/faculty.entity';
import { OfferHelpPost } from './entities/offer-help-post.entity';
import { RequestHelpPost } from './entities/request-help-post.entity';
import { TryOutTutor } from './entities/tryout-tutor.entity';
import { CoursesService } from './services/courses.service';
import { PostsService } from './services/posts.service';

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
