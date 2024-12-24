import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { isInstance } from 'class-validator';
import { ProfilesService } from '../profiles/profiles.service';
import { CommentDto } from './dto/comment.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { MyPostDto, PostDto } from './dto/post.dto';
import {
  Comment,
  OfferHelpPost,
  RequestHelpPost,
} from './entities/post.entity';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(
    private readonly profilesService: ProfilesService,
    @InjectRepository(RequestHelpPost)
    private readonly rHelpPostRepository: EntityRepository<RequestHelpPost>,
    @InjectRepository(OfferHelpPost)
    private readonly oHelpPostRepository: EntityRepository<OfferHelpPost>,
    @InjectRepository(Comment)
    private readonly commentRepository: EntityRepository<Comment>,
  ) {}

  async getMyPosts(
    userId: number,
    courseId: number,
  ): Promise<{ results: any }> {
    let requestHelpPosts: RequestHelpPost[] = [];
    let offerHelpPosts: OfferHelpPost[] = [];

    const { studentProfile, tutorProfile } =
      await this.profilesService.getBothProfiles(userId);

    if (!studentProfile && !tutorProfile) {
      throw new NotFoundException('User profiles not found');
    }

    try {
      requestHelpPosts = await this.rHelpPostRepository.find({
        $and: [{ course: courseId }, { student: studentProfile }],
      });

      offerHelpPosts = await this.oHelpPostRepository.find({
        $and: [{ course: courseId }, { tutor: tutorProfile }],
      });

      const posts = [...requestHelpPosts, ...offerHelpPosts];
      const myPosts = posts.map((post) =>
        plainToInstance(MyPostDto, {
          id: post.id,
          title: post.title,
          description: post.description,
          subject: post.subject,
          created_at: post.createdAt,
          updated_at: post.updatedAt,
          pfp_url: isInstance(post, RequestHelpPost)
            ? (post as RequestHelpPost).student.profile_picture
            : (post as OfferHelpPost).tutor.profile_picture,
          post_type: isInstance(post, RequestHelpPost)
            ? 'Solicitud de ayuda'
            : 'Oferta de ayuda',
        }),
      );
      return { results: myPosts };
    } catch (error) {
      this.logger.error(error);
    }

    return { results: [] };
  }

  // Request Help Posts
  async getPosts(courseId: number, mode: string): Promise<{ results: any }> {
    let posts: OfferHelpPost[] | RequestHelpPost[] = [];
    if (mode === 'request') {
      posts = await this.rHelpPostRepository.find({ course: courseId });
    } else {
      posts = await this.oHelpPostRepository.find({ course: courseId });
    }

    const serializedPosts = posts.map((post) =>
      plainToInstance(PostDto, {
        id: post.id,
        title: post.title,
        description: post.description,
        subject: post.subject,
        created_at: post.createdAt,
        updated_at: post.updatedAt,
        pfp_url: isInstance(post, RequestHelpPost)
          ? (post as RequestHelpPost).student.profile_picture
          : (post as OfferHelpPost).tutor.profile_picture,
        // Add the student or tutor username to the post based on the mode
        ...(mode === 'request'
          ? { student: (post as RequestHelpPost).student.user.username }
          : { tutor: (post as OfferHelpPost).tutor.user.username }),
      }),
    );

    return {
      results: serializedPosts,
    };
  }

  async createPost(
    createPostDto: CreatePostDto,
    userId: number,
    mode: string,
    courseId: number,
  ): Promise<OfferHelpPost | RequestHelpPost> {
    const { studentProfile, tutorProfile } =
      await this.profilesService.getBothProfiles(userId);

    if (mode === 'request') {
      const requestHelpPost = this.rHelpPostRepository.create({
        ...createPostDto,
        student: studentProfile,
        course: courseId,
      });
      await this.rHelpPostRepository
        .getEntityManager()
        .persistAndFlush(requestHelpPost);
      return requestHelpPost;
    } else if (mode === 'offer') {
      const offerHelpPost = this.oHelpPostRepository.create({
        ...createPostDto,
        tutor: tutorProfile,
        course: courseId,
      });
      await this.oHelpPostRepository
        .getEntityManager()
        .persistAndFlush(offerHelpPost);
      return offerHelpPost;
    } else {
      this.logger.error('Invalid mode');
      return null;
    }
  }

  async getComments(
    postId: string,
    mode: string,
  ): Promise<{ results: CommentDto[] }> {
    let post: OfferHelpPost | RequestHelpPost;
    if (mode === 'request') {
      post = await this.rHelpPostRepository.findOne(
        { id: postId },
        { populate: ['comments'] },
      );
    } else {
      post = await this.oHelpPostRepository.findOne(
        { id: postId },
        { populate: ['comments'] },
      );
    }

    if (!post) {
      this.logger.error('Post not found');
      return { results: [] };
    }

    const comments = isInstance(post, RequestHelpPost)
      ? (post as RequestHelpPost).comments.getItems()
      : (post as OfferHelpPost).comments.getItems();

    return {
      results: comments.map((comment) =>
        plainToInstance(CommentDto, {
          id: comment.id,
          content: comment.content,
          created_at: comment.createdAt,
          updated_at: comment.updatedAt,
          user: comment.user.username,
          pfp_url: comment.pfpUrl,
        }),
      ),
    };
  }

  async createComment(
    userId: number,
    postId: string,
    mode: string,
    content: string,
    profileMode: string,
  ) {
    let post: OfferHelpPost | RequestHelpPost;
    if (mode === 'request') {
      post = await this.rHelpPostRepository.findOne({ id: postId });
    } else {
      post = await this.oHelpPostRepository.findOne({ id: postId });
    }

    if (!post) {
      this.logger.error('Post not found');
      return;
    }

    const { studentProfile, tutorProfile } =
      await this.profilesService.getBothProfiles(userId);

    const comment = await this.commentRepository.create({
      content,
      user: studentProfile.user,
      // Set the requestHelpPost or offerHelpPost based on the mode
      ...(mode === 'request'
        ? { requestHelpPost: post }
        : { offerHelpPost: post }),
      ...(profileMode === 'student'
        ? { pfpUrl: studentProfile.profile_picture }
        : { pfpUrl: tutorProfile.profile_picture }),
    });

    if (mode === 'request') {
      (post as RequestHelpPost).comments.add(comment);
    } else {
      (post as OfferHelpPost).comments.add(comment);
    }

    await this.rHelpPostRepository.getEntityManager().persistAndFlush(post);

    return plainToInstance(CommentDto, {
      id: comment.id,
      content: comment.content,
      created_at: comment.createdAt,
      updated_at: comment.updatedAt,
      user: comment.user.username,
      pfp_url: comment.pfpUrl,
    });
  }
}
