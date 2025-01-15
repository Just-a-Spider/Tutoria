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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Posts')
@Controller('courses/:courseId')
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('my-posts')
  @ApiOperation({ summary: 'Get my posts' })
  @ApiResponse({ status: 200, description: 'List of my posts' })
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
  @ApiOperation({ summary: 'Get request help posts' })
  @ApiResponse({ status: 200, description: 'List of request help posts' })
  getRequestHelpPosts(
    @Req() req,
    @Param('courseId') courseId: number,
    @Query('offset') offset: number,
  ) {
    const baseUrl = `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}`;
    return this.postsService.getPosts(courseId, 'request', offset, baseUrl);
  }

  @Post('request-help-posts')
  @ApiOperation({ summary: 'Create request help post' })
  @ApiResponse({ status: 201, description: 'Request help post created' })
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
  @ApiOperation({ summary: 'Get offer help posts' })
  @ApiResponse({ status: 200, description: 'List of offer help posts' })
  getOfferHelpPosts(
    @Req() req,
    @Param('courseId') courseId: number,
    @Query('offset') offset: number,
  ) {
    const baseUrl = `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}`;
    return this.postsService.getPosts(courseId, 'offer', offset, baseUrl);
  }

  @Post('offer-help-posts')
  @ApiOperation({ summary: 'Create offer help post' })
  @ApiResponse({ status: 201, description: 'Offer help post created' })
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
  @ApiOperation({ summary: 'Get comments for request help post' })
  @ApiResponse({
    status: 200,
    description: 'List of comments for request help post',
  })
  getRequestHelpPostComments(@Param('postId') postId: string) {
    return this.postsService.getComments(postId, 'request');
  }

  @Post('request-help-posts/:postId/comments')
  @ApiOperation({ summary: 'Create comment for request help post' })
  @ApiResponse({
    status: 201,
    description: 'Comment created for request help post',
  })
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
  @ApiOperation({ summary: 'Get comments for offer help post' })
  @ApiResponse({
    status: 200,
    description: 'List of comments for offer help post',
  })
  getOfferHelpPostComments(@Param('postId') postId: string) {
    return this.postsService.getComments(postId, 'offer');
  }

  @Post('offer-help-posts/:postId/comments')
  @ApiOperation({ summary: 'Create comment for offer help post' })
  @ApiResponse({
    status: 201,
    description: 'Comment created for offer help post',
  })
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
