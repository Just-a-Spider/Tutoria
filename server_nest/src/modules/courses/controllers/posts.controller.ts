import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt.guard';
import { CreatePostDto } from '../dto/create-post.dto';
import { PostsService } from '../services/posts.service';

@Controller('courses/:courseId')
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('my-posts')
  getMyPosts(
    @Req() req,
    @Param('courseId') courseId: number,
    @Query('offset') offset: number,
  ) {
    const userId = req.user.id;
    const baseUrl = `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}`;
    return this.postsService.getMyPosts(userId, courseId, offset, baseUrl);
  }

  @Get('request-help-posts')
  getRequestHelpPosts(
    @Req() req,
    @Param('courseId') courseId: number,
    @Query('offset') offset: number,
  ) {
    const baseUrl = `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}`;
    return this.postsService.getPosts(courseId, 'request', offset, baseUrl);
  }

  @Post('request-help-posts')
  createRequestHelpPost(
    @Req() req,
    @Param('courseId') courseId: number,
    @Body() createPostDto: CreatePostDto,
  ) {
    const userId = req.user.id;
    return this.postsService.createPost(
      createPostDto,
      userId,
      'request',
      courseId,
    );
  }

  @Get('offer-help-posts')
  getOfferHelpPosts(
    @Req() req,
    @Param('courseId') courseId: number,
    @Query('offset') offset: number,
  ) {
    const baseUrl = `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}`;
    return this.postsService.getPosts(courseId, 'offer', offset, baseUrl);
  }

  @Post('offer-help-posts')
  createOfferHelpPost(
    @Req() req,
    @Param('courseId') courseId: number,
    @Body() createPostDto: CreatePostDto,
  ) {
    const userId = req.user.id;
    return this.postsService.createPost(
      createPostDto,
      userId,
      'offer',
      courseId,
    );
  }

  @Get('request-help-posts/:postId/comments')
  getRequestHelpPostComments(@Param('postId') postId: string) {
    return this.postsService.getComments(postId, 'request');
  }

  @Post('request-help-posts/:postId/comments')
  createRequestHelpPostComment(
    @Req() req,
    @Param('postId') postId: string,
    @Body('content') content: string,
    @Query('profileMode') profileMode: 'student' | 'tutor',
  ) {
    const userId = req.user.id;
    return this.postsService.createComment(
      userId,
      postId,
      'request',
      content,
      profileMode,
    );
  }

  @Get('offer-help-posts/:postId/comments')
  getOfferHelpPostComments(@Param('postId') postId: string) {
    return this.postsService.getComments(postId, 'offer');
  }

  @Post('offer-help-posts/:postId/comments')
  createOfferHelpPostComment(
    @Req() req,
    @Param('postId') postId: string,
    @Body('content') content: string,
    @Query('profileMode') profileMode: 'student' | 'tutor',
  ) {
    const userId = req.user.id;
    return this.postsService.createComment(
      userId,
      postId,
      'offer',
      content,
      profileMode,
    );
  }
}
